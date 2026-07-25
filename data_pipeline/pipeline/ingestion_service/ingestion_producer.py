import asyncio
import time

from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, RAW_SUBJECT
from data_pipeline.models.raw_article import RawArticle
from data_pipeline.pipeline.ingestion_service.ingestion_processor import IngestionProcessor
from data_pipeline.config.ingestion_config import get_rss_urls

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class IngestionProducer:
    def __init__(self, js=None, scraper=None, poll_interval=300):
        self.js = js
        self.poll_interval = poll_interval
        self.scraper = scraper
        self.logger = LoggerFactory.get_logger(LoggerName.Ingestion.PRODUCER)

    async def publish_article(self, article: RawArticle):
        try:
            ack = await asyncio.wait_for(
                self.js.publish(
                    RAW_SUBJECT,
                    article.model_dump_json().encode()
                ),
                timeout=10
            )

            self.logger.debug(
                "Raw article published",
                news_id=str(article.newsId),
                seq=ack.seq
            )

        except asyncio.TimeoutError:
            self.logger.warning(
                "Publish timeout",
                news_id=str(article.newsId)
            )

        except Exception:
            self.logger.exception(
                "Failed to publish article",
                news_id=str(article.newsId)
            )

    async def run(self):

        self.logger.info(
            "Ingestion producer started",
            poll_interval=self.poll_interval
        )

        while True:
            try:
                start = time.perf_counter()
                new_articles: list[RawArticle] = await self.scraper.scrape()
                duration = (time.perf_counter() - start) * 1000

                self.logger.info(
                    "RSS fetch completed",
                    articles=len(new_articles),
                    duration_ms=round(duration, 2)
                )

                if new_articles:
                    await asyncio.gather(
                        *(self.publish_article(article) for article in new_articles)
                    )
            except Exception as e:
                self.logger.exception("RSS scraper failed")
            await asyncio.sleep(self.poll_interval)


async def main():
    rss_urls = get_rss_urls()
    nc, js = await create_js()
    await ensure_stream(js)
    scraper = IngestionProcessor(rss_urls)
    raw_data_producer = IngestionProducer(js, scraper, poll_interval=300)
    await raw_data_producer.run()