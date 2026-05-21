import asyncio

from data_pipeline.pipeline.ingestion_service.ingestion_processor import IngestionProcessor
from data_pipeline.config.ingestion_config import get_rss_urls

async def ingestion_service():
    urls = get_rss_urls()
    ingestion_processor = IngestionProcessor(urls)
    result = await ingestion_processor.scrape()
    print("ingestion_processor_result",result[:2])

async def normalization_service():
    pass

def inference_service():
    pass

def graph_service():
    pass

if __name__ == "__main__":
    asyncio.run(ingestion_service())