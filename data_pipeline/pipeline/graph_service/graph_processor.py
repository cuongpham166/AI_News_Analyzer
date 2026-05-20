from pathlib import Path
from neo4j import GraphDatabase
from datetime import datetime, timezone
from ai.responses.inference_response import InferenceResult
from ai.responses.ner_response import NerEntity, NerResult
from data_pipeline.models.inference_article import InferenceArticle, Topic, Source, News, Entities, Person, Organization, Location, Event
from data_pipeline.utils.create_neo4j_entity_id import create_entity_id

class GraphProcessor:
    def __init__(self,graph_config=None):
        self.graph_config = graph_config
        self.driver = None

    def close(self):
        if self.driver:
            self.driver.close()

    def connect(self):
        uri = self.graph_config.uri
        username = self.graph_config.username
        password = self.graph_config.password
        self.driver = GraphDatabase(uri,auth=(username,password))

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

    def map_ner_to_entities(ner_response:NerResult) -> Entities:
        entities = Entities()
        for ent in ner_response.entities:
            entity_type = ent.type.lower()
            if entity_type == "person":
                entities.persons.append(Person(id=create_entity_id(entity_type, ent.value), name=ent.value))
            elif entity_type == "organization":
                entities.organizations.append(Organization(id=create_entity_id(entity_type, ent.value), name=ent.value))
            elif entity_type == "location":
                entities.locations.append(Location(id=create_entity_id(entity_type, ent.value), name=ent.value))
            elif entity_type == "event":
                entities.events.append(Event(id=create_entity_id(entity_type, ent.value), name=ent.value))
        return entities

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
        entities = self.map_ner_to_entities(inference_result.ner)
        article_data = InferenceArticle(
            source=source,
            topic=topic,
            news=news,
            entities=entities
        )
        self.save_articles(article_data)

    def save_articles(self, article_data: InferenceArticle):
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
            "entities": data_dict["entities"]
        }

        with self.driver.session() as session:
            session.execute_write(
                lambda tx: tx.run(cypher_query, **flat_article_data)
            )