
import asyncio
import json
from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, RAW_SUBJECT, ENRICHED_SUBJECT, STREAM_NAME
from data_pipeline.pipeline.normalization_service.normalization_processor import NormalizationProcessor
from data_pipeline.models.processed_article import ProcessedArticle


class NormalizationConsumer:
    def __init__(self, js, processor):
        self.js = js
        self.processor = processor

    async def handle(self, msg):
        try:
            processed_result: ProcessedArticle = await self.processor.process_message(msg)
            if processed_result is None:
                print("Skipping article")
                await msg.ack()
                return

            await self.js.publish(
                ENRICHED_SUBJECT,
                processed_result.model_dump_json().encode()
            )

            await msg.ack()
        except Exception as e:
            print(f"Error: {e}")
            await msg.nak(delay=5)
            raise

    async def run(self):
        sub = await self.js.subscribe(
            subject=RAW_SUBJECT,
            stream=STREAM_NAME,
            durable="normalization-consumer",
            deliver_policy="all",
            manual_ack=True,
        )

        print(f"Subscribed to {RAW_SUBJECT}")

        async for msg in sub.messages:
            await self.handle(msg)


async def main():
    nc, js = await create_js()
    await ensure_stream(js)
    processor = NormalizationProcessor()
    consumer = NormalizationConsumer(js, processor)
    await consumer.run()

if __name__ == "__main__":
    asyncio.run(main())