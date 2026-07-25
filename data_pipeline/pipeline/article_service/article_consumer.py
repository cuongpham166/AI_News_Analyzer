import json
import asyncio
import tldextract
import psycopg
from nats.aio.msg import Msg

from ai.responses.saved_inference_response import SavedInferenceResponse
from data_pipeline.nats.client import create_js
from data_pipeline.nats.streams import ensure_stream, ENRICHED_SUBJECT, AI_SUBJECT, SAVED_INFERENCE_SUBJECT,STREAM_NAME
from data_pipeline.config.article_config import get_postgres_config
from data_pipeline.pipeline.article_service.article_processor import ArticleProcessor
from data_pipeline.pipeline.article_service.article_repository import ArticleRepository

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class ArticleConsumer:
    def __init__(self, js, article_processor):
        self.js = js
        self.article_processor = article_processor
        self.logger = LoggerFactory.get_logger(LoggerName.Article.CONSUMER)

    def check_connection(self):
        self.article_processor.check_connection()

    async def publish_saved_inference_article(self, saved_result: SavedInferenceResponse):
        try:
            ack = await asyncio.wait_for(
                self.js.publish(
                    SAVED_INFERENCE_SUBJECT,
                    saved_result.model_dump_json().encode()
                ),
                timeout=10
            )

            self.logger.debug(
                "Saved inference article published",
                news_id=str(saved_result.newsId),
                seq=ack.seq,
            )
        except asyncio.TimeoutError:
            self.logger.warning(
                "Publish timeout",
                news_id=str(saved_result.newsId)
            )

    async def process_enriched_message(self, msg:Msg):
        enriched_article = json.loads(msg.data.decode())
        try:
            self.article_processor.insert_news(enriched_article)
            self.logger.exception(
                "Enriched news saved.",
                news_id=str(enriched_article["newsId"])
            )
            await msg.ack()
        except Exception as e:
            self.logger.exception(
                "Saving enriched news failed.",
                news_id=str(enriched_article["newsId"])
            )
            await msg.nak(delay=5)

    async def process_ai_message(self, msg):
        ai_article = json.loads(msg.data.decode())
        try:
            if self.article_processor.insert_inference_news(inference_news=ai_article):
                self.logger.exception(
                    "Inference news saved.",
                    news_id=str(ai_article["newsId"])
                )
                saved_result = SavedInferenceResponse.model_validate(ai_article)
                await self.publish_saved_inference_article(saved_result)
            await msg.ack()
        except Exception as e:
            self.logger.exception(
                "Saving inference news failed.",
                news_id=str(ai_article["newsId"])
            )
            await msg.nak(delay=5)

    async def retrieve_enriched_articles(self):

        self.logger.info("Article consumer started")

        sub = await self.js.subscribe(
            ENRICHED_SUBJECT,
            stream=STREAM_NAME,
            durable="article-consumer-enriched",
            deliver_policy="all",
            manual_ack=True,
        )

        self.logger.info(f"Subscribed to {ENRICHED_SUBJECT}.")

        async for msg in sub.messages:
            await self.process_enriched_message(msg)

    async def retrieve_ai_articles(self):
        sub = await self.js.subscribe(
            AI_SUBJECT,
            durable="article-consumer-ai",
            deliver_policy="all",
            manual_ack=True,
        )

        self.logger.info(f"Subscribed to {AI_SUBJECT}.")

        async for msg in sub.messages:
            await self.process_ai_message(msg)


    async def publish_article(self, article: dict):
        await self.js.publish(
            ENRICHED_SUBJECT,
            json.dumps(article).encode()
        )

    """
    async def recover_missing_data(self):
        print("recover_missing_data")
        missing_news = self.article_processor.fetch_missing_data()
        for row in missing_news:
            sql_timestamp = row[1]
            epoch_seconds = int(sql_timestamp.timestamp())

            ext = tldextract.extract(row[2])
            domain_name = ext.domain.upper()

            enriched_article = {
                "title": row[0],
                "publish_date": epoch_seconds,
                "source": domain_name,
                "link": row[2],
                "language": row[3],
                "text": row[4]
            }
            await self.publish_article(enriched_article)
    """

async def main():
    nc, js = await create_js()
    await ensure_stream(js)
    config = get_postgres_config()
    conn = psycopg.connect(**config)
    try:
        article_repo = ArticleRepository(conn)
        article_processor = ArticleProcessor(article_repo)
        article_consumer = ArticleConsumer(js, article_processor)
        await asyncio.gather(
            article_consumer.retrieve_enriched_articles(),
            article_consumer.retrieve_ai_articles()
        )
    finally:
        conn.close()