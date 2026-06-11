from pathlib import Path
from neo4j import GraphDatabase
import ollama
from datetime import datetime, timezone

from ai.responses.inference_response import InferenceResult
from ai.responses.ner_response import NerEntity, NerResult

from data_pipeline.config.graph_config import get_neo4j_config
from data_pipeline.models.inference_article import InferenceArticle, Topic, Source, News
from data_pipeline.utils.graph_processor_utils import build_metablock_for_embedding,map_ner_to_entities

from concurrent.futures import ProcessPoolExecutor

GRAPH_EXECUTOR = ProcessPoolExecutor(max_workers=2)

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


    def process_article(self, inference_result:dict):
        print("process_article_graph_repo: ",inference_result)
        result_obj = InferenceResult(**inference_result)
        source = Source(name=result_obj.source)
        topic = Topic(name=result_obj.classification.topic)
        publish_date = datetime.fromtimestamp(result_obj.publish_date, tz=timezone.utc)

        news = News(
            link=result_obj.link,
            title=result_obj.title,
            publish_date=publish_date,
            sentiment=result_obj.sentiment.score if result_obj.sentiment else 0.0,
            language=result_obj.language,
            summary=result_obj.summarization
        )
        news_embedding = self.generate_boosted_summary_embedding(
            title_text=result_obj.title,
            summary_text=result_obj.summarization,
            ner_response=result_obj.ner
        )
        entities = map_ner_to_entities(result_obj.ner)

        article_data = InferenceArticle(
            source=source,
            topic=topic,
            news=news,
            entities=entities,
            keyphrases=result_obj.keyphrases.results

        )

        return self.save_articles(article_data,news_embedding)

    def save_articles(self, article_data: InferenceArticle,news_embedding):
        cypher_file = Path("data_pipeline/script/neo4j/ingestion_data.cypher")
        cypher_query = cypher_file.read_text()
        data_dict = article_data.model_dump()
        data_dict["entities"] = article_data.entities.model_dump()
        publish_date = data_dict["news"]["publish_date"]
        if hasattr(publish_date, "strftime"):
            news_publish_date = publish_date.strftime("%Y-%m-%dT%H:%M:%S")
        else:
            news_publish_date = str(publish_date)
        flat_article_data = {
            "source_name": data_dict["source"]["name"],
            "topic_name": data_dict["topic"]["name"],
            "news_link": data_dict["news"]["link"],
            "news_title": data_dict["news"]["title"],
            "news_publish_date": news_publish_date,
            "news_sentiment": data_dict["news"]["sentiment"],
            "news_summary": data_dict["news"]["summary"],
            "news_language": data_dict["news"]["language"],
            "news_embedding": news_embedding,
            "entities": data_dict["entities"],
            "keyphrases":data_dict["keyphrases"]
        }

        print("Saving article to Neo4j:")
        print(flat_article_data["news_link"])
        print("Entities:", flat_article_data["entities"])

        def write(tx):
            result = tx.run(cypher_query, **flat_article_data)
            summary = result.consume()

            print("Neo4j write counters:", summary.counters)

            return summary.counters

        try:
            with self.driver.session() as session:
                counters = session.execute_write(write)

            return flat_article_data

        except Exception as e:
            print("Neo4j write failed:", str(e))


if __name__ == "__main__":
    graph_config = get_neo4j_config()
    driver = GraphDatabase.driver(
        graph_config["uri"],
        auth=(graph_config["username"], graph_config["password"])
    )
    graph_repo = GraphRepository(driver)