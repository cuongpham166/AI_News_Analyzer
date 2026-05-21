import json
import asyncio

from ai.responses.inference_response import InferenceResponse, InferenceResult
from data_pipeline.pipeline.inference_service.inference_processor import InferenceProcessor
from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, ENRICHED_SUBJECT, AI_SUBJECT, STREAM_NAME

semaphore = asyncio.Semaphore(4)

class InferenceConsumer:
    def __init__(self, js,inference_processor):
        self.js = js
        self.inference_processor = inference_processor

    async def publish_article(self, article: InferenceResult):
        await self.js.publish(
            AI_SUBJECT,
            article.model_dump_json().encode()
        )

    async def process_message(self, msg):
        processed_article = json.loads(msg.data.decode())
        try:
            inference_data:InferenceResponse = self.inference_processor.analyze([processed_article])
            inference_results = inference_data.results

            for result in inference_results:
                await self.publish_article(result)
                await msg.ack()

        except Exception as e:
            print(f"Error processing article: {e}")
            await msg.term()

    async def run(self):
        try:
            await self.js.delete_consumer(STREAM_NAME, "enriched-articles-consumer-1")
        except Exception:
            pass

        sub = await self.js.subscribe(
            ENRICHED_SUBJECT,
            durable="enriched-articles-consumer-1",
            deliver_policy="all",
            manual_ack=True
        )
        print(f"Subscribed to {ENRICHED_SUBJECT}. Waiting for messages...")
        async for msg in sub.messages:
            await self.process_message(msg)


async def main():
    js = await create_js()
    await ensure_stream(js)
    inference_processor = InferenceProcessor()
    inference_consumer = InferenceConsumer(js,inference_processor)
    await inference_consumer.run()


if __name__ == "__main__":
    asyncio.run(main())
