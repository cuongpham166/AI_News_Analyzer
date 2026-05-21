import json
import asyncio
from neo4j import GraphDatabase

from ai.responses.inference_response import InferenceResult
from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, AI_SUBJECT
from data_pipeline.config.graph_config import get_neo4j_config
from data_pipeline.pipeline.graph_service.graph_repository import GraphRepository
from data_pipeline.pipeline.graph_service.graph_processor import GraphProcessor

class GraphConsumer:
    def __init__(self, js, graph_processor):
        self.js = js
        self.graph_processor = graph_processor

    async def process_ai_message(self, msg):
        ai_article:InferenceResult = json.loads(msg.data.decode())
        try:
            self.graph_processor.process_article(ai_article)
            await msg.ack()
        except Exception as e:
            print(f"Error processing ai article: {e}")
            await msg.nak(delay=5)

    async def run(self):
        sub = await self.js.subscribe(
            AI_SUBJECT,
            durable="graph-consumer",
            deliver_policy="all",
            ack_wait=30,
            max_deliver=5,
            manual_ack=True,
        )
        print(f"Subscribed to {AI_SUBJECT}. Waiting for messages...")
        async for msg in sub.messages:
            await self.process_ai_message(msg)

async def main():
    js = await create_js()
    await ensure_stream(js)
    graph_config = get_neo4j_config()
    driver = GraphDatabase.driver(
        graph_config.uri,
        auth=(graph_config.username, graph_config.password)
    )
    try:
        graph_repo = GraphRepository(driver)
        processor = GraphProcessor(graph_repo)
        graph_consumer = GraphConsumer(js,graph_processor=processor)
        await graph_consumer.run()
    finally:
        driver.close()

if __name__ == "__main__":
    asyncio.run(main())