import json
import asyncio
import time

from nats.aio.msg import Msg

from ai.responses.inference_response import InferenceResponse, InferenceResult
from data_pipeline.pipeline.inference_service.inference_processor import InferenceProcessor
from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, ENRICHED_SUBJECT, AI_SUBJECT, STREAM_NAME

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

semaphore = asyncio.Semaphore(1)

class InferenceConsumer:
    def __init__(self, js,inference_processor):
        self.js = js
        self.inference_processor = inference_processor
        self.logger = LoggerFactory.get_logger(LoggerName.Inference.CONSUMER)

    async def publish_article(self, article: InferenceResult):
        await self.js.publish(
            AI_SUBJECT,
            article.model_dump_json().encode()
        )

        self.logger.debug(
            "Inference article published",
            news_id=str(article.newsId)
        )

    async def process_message(self, msg:Msg):
        async with semaphore:
            processed_article = json.loads(msg.data.decode())
            try:
                start = time.perf_counter()
                inference_data:InferenceResponse = await asyncio.to_thread(
                    self.inference_processor.analyze,
                    [processed_article]
                )

                duration_ms = round(
                    (time.perf_counter() - start) * 1000,
                    2
                )
                if duration_ms > 5000:
                    self.logger.warning(
                        "Slow inference detected",
                        news_id=str(processed_article["newsId"]),
                        duration_ms=duration_ms
                    )
                else:
                    self.logger.info(
                        "News inference completed",
                        news_id=str(processed_article["newsId"]),
                        duration_ms=duration_ms
                    )

                for result in inference_data.results:
                    await self.publish_article(result)
                await msg.ack()

            except Exception as e:
                self.logger.exception(
                    "Analyzing enriched news failed.",
                    news_id=str(processed_article["newsId"])
                )
                await msg.term()

    async def run(self):
        self.logger.info("Inference consumer started")

        sub = await self.js.subscribe(
            ENRICHED_SUBJECT,
            stream=STREAM_NAME,
            durable="enriched-articles-consumer-1",
            deliver_policy="all",
            manual_ack=True
        )

        self.logger.info(f"Subscribed to {ENRICHED_SUBJECT}.")

        async for msg in sub.messages:
            asyncio.create_task(
                self.process_message(msg)
            )


async def main(inference_processor):
    nc, js = await create_js()
    await ensure_stream(js)
    #inference_processor = InferenceProcessor()
    inference_consumer = InferenceConsumer(js,inference_processor)
    await inference_consumer.run()