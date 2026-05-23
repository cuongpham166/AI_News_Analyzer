import asyncio
import json
from datetime import datetime, timezone
from neo4j import GraphDatabase

from ai.responses.inference_response import InferenceResponse, InferenceResult
from data_pipeline.config.graph_config import get_neo4j_config
from data_pipeline.models.processed_article import ProcessedArticle
from data_pipeline.models.raw_article import RawArticle
from data_pipeline.pipeline.article_service.article_processor import ArticleProcessor
from data_pipeline.pipeline.article_service.article_test_repository import ArticleTestRepository
from data_pipeline.pipeline.graph_service.graph_processor import GraphProcessor
from data_pipeline.pipeline.graph_service.graph_repository import GraphRepository
from data_pipeline.pipeline.indexing_service.indexing_processor import IndexingProcessor
from data_pipeline.pipeline.indexing_service.indexing_test_repository import IndexingTestRepository
from data_pipeline.pipeline.inference_service.inference_processor import InferenceProcessor
from data_pipeline.pipeline.ingestion_service.ingestion_processor import IngestionProcessor
from data_pipeline.config.ingestion_config import get_rss_urls
from data_pipeline.pipeline.normalization_service.normalization_processor import NormalizationProcessor


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

    async def run_article_service_insert(self,published_processed_article):
        msg={"data":published_processed_article}
        enriched_article = json.loads(msg["data"].decode())
        self.article_processor.insert_news_data(enriched_article)

    async def run_article_service_update(self,published_inference_article):
        msg={"data":published_inference_article}
        ai_article = json.loads(msg["data"].decode())
        """
        {
            'link': 'https://news.un.org/feed/view/en/story/2026/05/1167567', 
            'publish_date': 1779364800, 
            'language': 'en', 
            'title': 'UN agencies step up Ebola response in eastern DR Congo', 
            'source': 'UN', 
            'sentiment': {'label': 'positive', 'score': 0.9855}, 
            'classification': {'topic': 'world'}, 
            'ner': {'entities': [{'value': 'UN World Health Organization', 'type': 'organization'}, {'value': 'WHO', 'type': 'organization'}, {'value': 'DRC', 'type': 'location'}]}, 
            'summarization': ' The UN is helping to strengthen preparedness and raise awareness in at-risk communities . The UN peacekeeping mission in the DRC, known as MONUSCO, quickly deployed its air assets to support the Congolese authorities .'
        }
        """
        self.article_processor.update_news_data(ai_article)

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

    try:
        ingestion_processor = IngestionProcessor(rss_urls=urls)
        normalization_processor= NormalizationProcessor()
        inference_processor = InferenceProcessor()
        graph_repo = GraphRepository(driver)
        graph_processor = GraphProcessor(graph_repo)

        article_repo = ArticleTestRepository()
        article_processor = ArticleProcessor(article_repo)

        indexing_repo = IndexingTestRepository()
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
        published_inference_article = await demo_pipeline.run_inference_service(published_processed_article)
        await demo_pipeline.run_graph_service(published_inference_article)
        await demo_pipeline.run_article_service_insert(published_processed_article)
        await demo_pipeline.run_article_service_update(published_inference_article)
        await demo_pipeline.run_indexing_service(published_inference_article)

    finally:
        driver.close()



if __name__ == "__main__":
    asyncio.run(run_demo())