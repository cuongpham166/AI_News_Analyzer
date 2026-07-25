import asyncio
import json
from datetime import datetime, timezone
from neo4j import GraphDatabase
import psycopg
from elasticsearch import Elasticsearch

from ai.responses.inference_response import InferenceResponse, InferenceResult
from data_pipeline.config.graph_config import get_neo4j_config
from data_pipeline.models.processed_article import ProcessedArticle
from data_pipeline.models.raw_article import RawArticle
from data_pipeline.pipeline.article_service.article_processor import ArticleProcessor
from data_pipeline.pipeline.article_service.article_test_repository import ArticleTestRepository
from data_pipeline.config.article_config import get_postgres_config
from data_pipeline.pipeline.article_service.article_repository import ArticleRepository
from data_pipeline.pipeline.graph_service.graph_processor import GraphProcessor
from data_pipeline.pipeline.graph_service.graph_repository import GraphRepository
from data_pipeline.pipeline.indexing_service.indexing_processor import IndexingProcessor
from data_pipeline.pipeline.indexing_service.indexing_test_repository import IndexingTestRepository
from data_pipeline.pipeline.inference_service.inference_processor import InferenceProcessor
from data_pipeline.pipeline.ingestion_service.ingestion_processor import IngestionProcessor
from data_pipeline.config.ingestion_config import get_rss_urls
from data_pipeline.pipeline.normalization_service.normalization_processor import NormalizationProcessor
from data_pipeline.config.indexing_config import get_elasticsearch_config
from data_pipeline.pipeline.indexing_service.indexing_repository import IndexingRepository

class DemoPipeline:
    def __init__(
            self,
            ingestion_processor,
            normalization_processor,
            inference_processor,
            graph_processor,
            article_processor,
            indexing_processor
    ):
        self.ingestion_processor = ingestion_processor
        self.normalization_processor = normalization_processor
        self.inference_processor = inference_processor
        self.graph_processor = graph_processor
        self.article_processor = article_processor
        self.indexing_processor = indexing_processor

    async def run_ingestion_service(self):
        new_articles: list[RawArticle] = await self.ingestion_processor.scrape()
        raw_article: RawArticle = new_articles[2]
        published_raw_article = raw_article.model_dump_json().encode()
        return published_raw_article

    async def run_normalization_service(self,published_raw_article):
        msg={"data":published_raw_article}
        processed_result: ProcessedArticle = await self.normalization_processor.process_message(msg)
        published_processed_article = processed_result.model_dump_json().encode()
        return published_processed_article

    async def run_inference_service(self,published_processed_article):
        msg={"data":published_processed_article}
        processed_article = json.loads(msg["data"].decode())
        inference_data:InferenceResponse = self.inference_processor.analyze([processed_article])
        inference_results = inference_data.results
        published_inference_article = inference_results[0].model_dump_json().encode()
        return published_inference_article

    async def run_graph_service(self,published_inference_article):
        msg={"data":published_inference_article}
        ai_article:InferenceResult = json.loads(msg["data"].decode())
        self.graph_processor.process_article(ai_article)

    async def run_article_service_insert_news(self,published_processed_article):
        msg={"data":published_processed_article}
        enriched_article = json.loads(msg["data"].decode())
        self.article_processor.insert_news(news=enriched_article)

    async def run_article_service_insert_inference_news(self,published_inference_article):
        msg={"data":published_inference_article}
        ai_article = json.loads(msg["data"].decode())
        self.article_processor.insert_inference_news(inference_news=ai_article)

    async def run_indexing_service(self,published_inference_article):
        msg={"data":published_inference_article}
        ai_article = json.loads(msg["data"].decode())
        index_time = datetime.now(timezone.utc).isoformat()
        ai_article["@timestamp"] = index_time
        self.indexing_processor.index_news_document(ai_article)



async def run_demo():
    urls = get_rss_urls()
    graph_config = get_neo4j_config()
    driver = GraphDatabase.driver(
        graph_config["uri"],
        auth=(graph_config["username"], graph_config["password"])
    )

    article_db_config = get_postgres_config()
    article_db_conn = psycopg.connect(**article_db_config)

    indexing_db_config = get_elasticsearch_config()
    indexing_db_client = Elasticsearch(indexing_db_config["elastic_url"])

    try:
        ingestion_processor = IngestionProcessor(rss_urls=urls)
        normalization_processor= NormalizationProcessor()
        inference_processor = InferenceProcessor()

        graph_repo = GraphRepository(driver)
        graph_processor = GraphProcessor(graph_repo)

        #article_repo = ArticleTestRepository()
        article_repo = ArticleRepository(conn=article_db_conn)
        article_processor = ArticleProcessor(article_repo)

        #indexing_repo = IndexingTestRepository()
        indexing_repo = IndexingRepository(es_client=indexing_db_client)
        indexing_processor = IndexingProcessor(indexing_repo)

        demo_pipeline = DemoPipeline(
            ingestion_processor,
            normalization_processor,
            inference_processor,
            graph_processor,
            article_processor,
            indexing_processor
        )

        published_raw_article = await demo_pipeline.run_ingestion_service()
        published_processed_article = await demo_pipeline.run_normalization_service(published_raw_article)
        #print("published_processed_article: ", published_processed_article)
        published_inference_article = await demo_pipeline.run_inference_service(published_processed_article)
        #print("published_inference_article: ",published_inference_article)

        #await demo_pipeline.run_article_service_insert_news(published_processed_article)
        #await demo_pipeline.run_article_service_insert_inference_news(published_inference_article)


        await demo_pipeline.run_graph_service(published_inference_article)
        #await demo_pipeline.run_indexing_service(published_inference_article)


    finally:
        driver.close()



if __name__ == "__main__":
    asyncio.run(run_demo())