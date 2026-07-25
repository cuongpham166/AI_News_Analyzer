import json
import asyncio

from nats.aio.msg import Msg

from ai.responses.inference_response import InferenceResponse, InferenceResult
from data_pipeline.pipeline.inference_service.inference_processor import InferenceProcessor
from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, ENRICHED_SUBJECT, AI_SUBJECT, STREAM_NAME

semaphore = asyncio.Semaphore(1)

class InferenceConsumer:
    def __init__(self, js,inference_processor):
        self.js = js
        self.inference_processor = inference_processor

    async def publish_article(self, article: InferenceResult):
        await self.js.publish(
            AI_SUBJECT,
            article.model_dump_json().encode()
        )

    async def process_message(self, msg:Msg):
        async with semaphore:
            processed_article = json.loads(msg.data.decode())
            print("Inference_consumer: ",processed_article)
            try:
                inference_data:InferenceResponse = await asyncio.to_thread(
                    self.inference_processor.analyze,
                    [processed_article]
                )

                for result in inference_data.results:
                    print("Inference_consumer_result: ", result)
                    await self.publish_article(result)
                await msg.ack()

            except Exception as e:
                print(f"Error processing article: {e}")
                await msg.term()

    async def run(self):
        sub = await self.js.subscribe(
            ENRICHED_SUBJECT,
            stream=STREAM_NAME,
            durable="enriched-articles-consumer-1",
            deliver_policy="all",
            manual_ack=True
        )
        print(f"Subscribed to {ENRICHED_SUBJECT}. Waiting for messages...")
        async for msg in sub.messages:
            asyncio.create_task(
                self.process_message(msg)
            )


async def main(inference_processor):
    print("Inference main started")
    nc, js = await create_js()
    print("Inference connected to NATS")
    await ensure_stream(js)
    print("Inference stream ready")
    #inference_processor = InferenceProcessor()
    inference_consumer = InferenceConsumer(js,inference_processor)
    print("Starting inference consumer")
    await inference_consumer.run()