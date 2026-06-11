import psycopg
import spacy
from keybert import KeyBERT
from pathlib import Path

from ai.analyzer.keyword_extractor.keyword_extractor import KeywordExtractor
from ai.utils.keyword_extractor.entity_deduplicator import EntityDeduplicator
from ai.utils.keyword_extractor.entity_extractor import EntityExtractor
from ai.utils.keyword_extractor.text_normalizer import TextNormalizer
from data_pipeline.config.article_config import get_postgres_config
from data_pipeline.pipeline.article_service.article_repository import ArticleRepository


class SyncData:
    def __init__(self,driver, es_client, graph_repo,indexing_repo,article_repo):
        self.driver = driver
        self.es_client = es_client
        self.graph_repo = graph_repo
        self.indexing_repo = indexing_repo
        self.article_repo = article_repo


    def get_all_elasticsearch_links(self):
        links = []

        resp = self.es_client.search(
            index="news",
            scroll="1m",
            size=1000,
            _source=["link"],
            body={
                "query": {"match_all": {}}
            }
        )

        scroll_id = resp["_scroll_id"]
        hits = resp["hits"]["hits"]

        while hits:
            for h in hits:
                if "link" in h["_source"]:
                    links.append(h["_source"]["link"])

            resp = self.es_client.scroll(scroll_id=scroll_id, scroll="1m")
            scroll_id = resp["_scroll_id"]
            hits = resp["hits"]["hits"]

        return links

    def update_full_text_by_elasticsearch_link(self,link: str, full_text: str):
        if not full_text:
            return

        response = self.es_client.update_by_query(
            index="news",
            refresh=True,
            body={
                "script": {
                    "source": "ctx._source.full_text = params.full_text",
                    "params": {
                        "full_text": full_text
                    }
                },
                "query": {
                    "term": {
                        "link": link.strip()
                    }
                }
            }
        )

        print(f"Updated documents: {response['updated']}")
        return response

    def update_full_text(self):
        config = get_postgres_config()
        conn = psycopg.connect(**config)
        article_repo = ArticleRepository(conn)
        document_links = self.indexing_repo.get_all_links()

        for link in document_links:
            full_text = self.article_repo.get_fulltext_by_link(link)
            self.update_full_text_by_elasticsearch_link(link,full_text)

    def get_all_links(self):
        cypher_file = Path("data_pipeline/script/neo4j/get_all_links.cypher")
        cypher_query = cypher_file.read_text()
        try:
            with self.driver.session() as session:
                result = session.run(cypher_query)
                return [record["link"] for record in result]

        except Exception as e:
            print("Neo4j get failed:", str(e))


    def update_keyphrases_by_link(self,news_link: str, keyphrases: list[str]):
        cypher_file = Path("data_pipeline/script/neo4j/update_keyphrase.cypher")
        cypher_query = cypher_file.read_text()
        try:
            with self.driver.session() as session:
                session.run(
                    cypher_query,
                    news_link=news_link,
                    keyphrases=keyphrases
                )
        except Exception as e:
            print("Neo4j update failed:", str(e))

    def update_keyphrases(self):
        config = get_postgres_config()
        conn = psycopg.connect(**config)
        article_repo = ArticleRepository(conn)
        document_links = self.graph_repo.get_all_links()

        spacy_processor = spacy.load("en_core_web_sm")
        kw_model = KeyBERT(model="all-MiniLM-L6-v2")
        text_normalizer = TextNormalizer()
        entity_extractor = EntityExtractor(text_normalizer)
        entity_deduplicator = EntityDeduplicator()

        keyword_extractor = KeywordExtractor(
            spacy=spacy_processor,
            kw_model=kw_model,
            text_normalizer=text_normalizer,
            entity_extractor=entity_extractor,
            entity_deduplicator=entity_deduplicator
        )

        for link in document_links:
            full_text = article_repo.get_fulltext_by_link(link)
            results = keyword_extractor.extract_keywords(text=full_text)
            self.update_keyphrases_by_link(news_link=link,keyphrases=results.results)