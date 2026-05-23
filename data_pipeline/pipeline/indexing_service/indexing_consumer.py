import json
import asyncio
from datetime import datetime, timezone
from elasticsearch import Elasticsearch
from nats.aio.msg import Msg

from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, AI_SUBJECT
from data_pipeline.config.indexing_config import get_elasticsearch_config
from data_pipeline.pipeline.indexing_service import indexing_processor
from data_pipeline.pipeline.indexing_service.indexing_processor import IndexingProcessor
from data_pipeline.pipeline.indexing_service.indexing_repository import IndexingRepository


class IndexingConsumer:
    def __init__(self, js, processor):
        self.js = js
        self.indexing_processor = processor

    async def process_ai_message(self, msg:Msg):
        ai_article = json.loads(msg.data.decode())
        try:
            index_time = datetime.now(timezone.utc).isoformat()
            ai_article["@timestamp"] = index_time
            self.indexing_processor.index_news_document(ai_article)
            await msg.ack()
        except Exception as e:
            print(f"Error[IndexingConsumer]processing ai article: {e}")
            await msg.nak(delay=5)

    async def run(self):
        sub = await self.js.subscribe(
            AI_SUBJECT,
            durable="indexing-consumer",
            deliver_policy="all",
            manual_ack=True,
        )
        print(f"Subscribed to {AI_SUBJECT}. Waiting for messages...")
        async for msg in sub.messages:
            await self.process_ai_message(msg)


async def main():
    js = await create_js()
    await ensure_stream(js)
    elastic_config = get_elasticsearch_config()
    es_client = Elasticsearch(elastic_config["elastic_url"])
    try:
        indexing_repo = IndexingRepository(es_client)
        index_processor =IndexingProcessor(indexing_repo)
        indexing_consumer = IndexingConsumer(js,processor=index_processor)
        await indexing_consumer.run()
    finally:
        es_client.close()


if __name__ == "__main__":
    asyncio.run(main())
