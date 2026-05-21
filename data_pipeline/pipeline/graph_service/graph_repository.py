from pathlib import Path
from neo4j import GraphDatabase
import ollama
from datetime import datetime, timezone
from ai.responses.inference_response import InferenceResult
from ai.responses.ner_response import NerEntity, NerResult
from data_pipeline.models.inference_article import InferenceArticle, Topic, Source, News
from data_pipeline.utils.graph_processor_utils import build_metablock_for_embedding,map_ner_to_entities

class GraphRepository:
    def __init__(self, driver):
        self.driver = driver

    def close(self):
        if self.driver:
            self.driver.close()

    def execute_cypher_file(self, file_path: Path):
        cypher_query = file_path.read_text()
        with self.driver.session() as session:
            session.execute_write(lambda tx: tx.run(cypher_query))
        print(f"Executed {file_path.name}")

    def create_constraints(self):
        constraints_folder = Path("data_pipeline/script/neo4j/constraints")
        cypher_files = sorted(constraints_folder.glob("*.cypher"))
        for file_path in cypher_files:
            self.execute_cypher_file(file_path)

    def generate_boosted_summary_embedding(self,title_text: str, summary_text: str, ner_response:NerResult):
        metadata_block = build_metablock_for_embedding(ner_response)
        boosted_text = (
            f"search_document: \n"
            f"TITLE: {title_text.strip()}\n"
            f"SUMMARY: {summary_text.strip()}\n"
            f"METADATA: {metadata_block}"
        )
        response = ollama.embeddings(model="nomic-embed-text", prompt=boosted_text)
        return response["embedding"]

    def process_article(self, inference_result:InferenceResult):
        source = Source(name=inference_result.source)
        topic = Topic(name=inference_result.classification.topic)
        publish_date = datetime.fromtimestamp(inference_result.publish_date, tz=timezone.utc)

        news = News(
            link=inference_result.link,
            title=inference_result.title,
            publish_date=publish_date,
            sentiment=inference_result.sentiment.score if inference_result.sentiment else 0.0,
            language=inference_result.language,
            summary=inference_result.summarization
        )
        news_embedding = self.generate_boosted_summary_embedding(
            title_text=inference_result.title,
            summary_text=inference_result.summarization,
            ner_response=inference_result.ner
        )
        entities = map_ner_to_entities(inference_result.ner)

        article_data = InferenceArticle(
            source=source,
            topic=topic,
            news=news,
            entities=entities
        )
        return self.save_articles(article_data,news_embedding)

    def save_articles(self, article_data: InferenceArticle,news_embedding):
        cypher_file = Path("data_pipeline/script/neo4j/ingestion_data.cypher")
        cypher_query = cypher_file.read_text()

        data_dict = article_data.model_dump()
        flat_article_data = {
            "source_name": data_dict["source"]["name"],
            "topic_name": data_dict["topic"]["name"],
            "news_link": data_dict["news"]["link"],
            "news_title": data_dict["news"]["title"],
            "news_publish_date": data_dict["news"]["publish_date"].isoformat(),
            "news_sentiment": data_dict["news"]["sentiment"],
            "news_summary": data_dict["news"]["summary"],
            "news_language": data_dict["news"]["language"],
            "news_embedding": news_embedding,
            "entities": data_dict["entities"]
        }
        return flat_article_data

        #with self.driver.session() as session:
        #    session.execute_write(
        #        lambda tx: tx.run(cypher_query, **flat_article_data)
        #    )