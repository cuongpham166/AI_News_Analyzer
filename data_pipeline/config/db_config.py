from neo4j import GraphDatabase
import psycopg
from elasticsearch import Elasticsearch

from data_pipeline.pipeline.article_service.article_repository import ArticleRepository
from data_pipeline.pipeline.graph_service.graph_repository import GraphRepository
from data_pipeline.pipeline.indexing_service.indexing_repository import IndexingRepository

from data_pipeline.config.article_config import get_topics,get_entity_types,get_table_name,get_postgres_config
from data_pipeline.config.graph_config import get_neo4j_config
from data_pipeline.config.indexing_config import get_elasticsearch_config

class DBConfig:
    def __init__(self, article_repository, graph_repository, indexing_repository):
        self.article_repository = article_repository
        self.graph_repository = graph_repository
        self.indexing_repository = indexing_repository

    def run_init_configs_article_db(self):
        topic_labels = get_topics()
        entity_types = get_entity_types()
        table_names = get_table_name()

        if self.article_repository.check_connection():
            for table_name in table_names:
                self.article_repository.create_table(table_name)

            self.article_repository.insert_topic_data(topic_labels)
            self.article_repository.insert_entity_type(entity_types)

    def run_init_configs_indexing_db(self):
        if self.indexing_repository.check_connection():
            self.indexing_repository.create_news_index()

    def run_init_configs_graph_db(self):
        if self.graph_repository.check_connection():
            self.graph_repository.create_constraints()


if __name__ == "__main__":
    article_config = get_postgres_config()
    article_conn = psycopg.connect(**article_config)

    graph_config = get_neo4j_config()
    graph_driver = GraphDatabase.driver(
        graph_config["uri"],
        auth=(graph_config["username"], graph_config["password"])
    )

    print(type(graph_driver))
    print(hasattr(graph_driver, "verify_connection"))
    print([m for m in dir(graph_driver) if "verify" in m])

    elastic_config = get_elasticsearch_config()
    es_client = Elasticsearch(elastic_config["elastic_url"])

    article_repo = ArticleRepository(conn=article_conn)
    graph_repo = GraphRepository(driver=graph_driver)
    indexing_repo = IndexingRepository(es_client)

    db_config = DBConfig(
        article_repository=article_repo,
        graph_repository=graph_repo,
        indexing_repository=indexing_repo
    )

    db_config.run_init_configs_article_db()
    #db_config.run_init_configs_graph_db()
    #db_config.run_init_configs_indexing_db()