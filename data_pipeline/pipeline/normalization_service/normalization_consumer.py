
import asyncio
import json
from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, RAW_SUBJECT, ENRICHED_SUBJECT, STREAM_NAME
from data_pipeline.pipeline.normalization_service.normalization_processor import NormalizationProcessor
from data_pipeline.models.processed_article import ProcessedArticle

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class NormalizationConsumer:
    def __init__(self, js, processor):
        self.js = js
        self.processor = processor
        self.logger = LoggerFactory.get_logger(LoggerName.Normalization.CONSUMER)

    async def handle(self, msg):
        try:
            self.logger.info("Processing article")

            start = time.perf_counter()
            processed_result: ProcessedArticle = await self.processor.process_message(msg)
            duration = (time.perf_counter() - start) * 1000

            self.logger.info(
                "Article normalized",
                news_id=str(processed_result.newsId),
                link=processed_result.link,
                duration_ms=round(duration, 2)
            )

            if processed_result is None:
                self.logger.info("Skipping article")
                await msg.ack()
                return

            await self.js.publish(
                ENRICHED_SUBJECT,
                processed_result.model_dump_json().encode()
            )

            self.logger.debug(
                "Normalized article published",
                news_id=str(processed_result.newsId),
                link=processed_result.link
            )

            await msg.ack()
        except Exception as e:
            self.logger.error("Normalization failed",exc_info=True)
            await msg.nak(delay=5)


    async def run(self):
        self.logger.info("Normalization consumer started")

        sub = await self.js.subscribe(
            subject=RAW_SUBJECT,
            stream=STREAM_NAME,
            durable="normalization-consumer",
            deliver_policy="all",
            manual_ack=True,
        )

        self.logger.info(f"Subscribed to {RAW_SUBJECT}")

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