import asyncio
import time
import psycopg
from psycopg.rows import dict_row

from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, RAW_SUBJECT
from data_pipeline.models.raw_article import RawArticle

from data_pipeline.pipeline.ingestion_service.ingestion_processor import IngestionProcessor
from data_pipeline.pipeline.ingestion_service.ingestion_repository import IngestionRepository
from data_pipeline.pipeline.ingestion_service.outbox_publisher import OutboxPublisher

from data_pipeline.config.ingestion_config import get_rss_urls
from data_pipeline.config.article_config import get_postgres_config

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class IngestionProducer:
    def __init__(
            self,
            scraper=None,
            repository=None,
            poll_interval=300
    ):
        self.scraper = scraper
        self.repository = repository
        self.poll_interval = poll_interval
        self.logger = LoggerFactory.get_logger(LoggerName.Ingestion.PRODUCER)

    async def save_article(self, article) -> bool:
        try:
            inserted = await asyncio.to_thread(
                self.repository.register_article,
                candidate=article,
            )

            if inserted:
                self.logger.debug("New article registered",extra={"link": article.link})
            else:
                self.logger.debug("Article already exists",extra={"link": article.link})
            return inserted

        except Exception:
            self.logger.exception("Failed to register article",extra={"link": article.link})
            return False

    async def run(self):
        self.logger.info("Ingestion producer started",extra={"poll_interval": self.poll_interval})

        while True:
            try:
                start = time.perf_counter()
                articles = (await self.scraper.scrape())
                duration = (time.perf_counter() - start) * 1000

                self.logger.info(
                    "RSS fetch completed",
                    extra={
                        "articles": len(articles),
                        "duration_ms": round(
                            duration,
                            2,
                        ),
                    },
                )

                if articles:
                    results = await asyncio.gather(
                        *(
                            self.save_article(article)
                            for article in articles
                        ),
                        return_exceptions=True,
                    )

                    new_articles = sum(
                        1
                        for result in results
                        if result is True
                    )

                    self.logger.info(
                        "Articles registered",
                        extra={
                            "discovered": len(articles),
                            "new": new_articles,
                        },
                    )

            except asyncio.CancelledError:
                raise

            except Exception:

                self.logger.exception(
                    "RSS ingestion failed"
                )

            await asyncio.sleep(
                self.poll_interval
            )

async def main():
    rss_urls = get_rss_urls()
    scraper = IngestionProcessor(rss_urls)

    config = get_postgres_config()

    producer_conn = psycopg.connect(
        **config,
        row_factory=dict_row,
    )

    outbox_conn = psycopg.connect(
        **config,
        row_factory=dict_row,
    )

    nc, js = await create_js()

    await ensure_stream(js)

    repository = IngestionRepository(
        conn=producer_conn
    )

    producer = IngestionProducer(
        scraper=scraper,
        repository=repository,
        poll_interval=300,
    )

    outbox = OutboxPublisher(
        js=js,
        conn=outbox_conn,
        batch_size=100,
        poll_interval=1
    )

    try:
        await asyncio.gather(producer.run(),outbox.run())
    finally:
        producer_conn.close()
        outbox_conn.close()
        await nc.drain()