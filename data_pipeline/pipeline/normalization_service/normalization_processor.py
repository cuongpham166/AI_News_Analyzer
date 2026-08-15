from langdetect import detect, LangDetectException
from nats.aio.msg import Msg
from newspaper import Article
import tldextract
import json
import asyncio
import hashlib
import time

from datetime import datetime
from email.utils import parsedate_to_datetime

from data_pipeline.models.processed_article import ProcessedArticle

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class NormalizationProcessor:
    def __init__(self):
        self.enriched_links = set()
        self.logger = LoggerFactory.get_logger(LoggerName.Normalization.PROCESSOR)

    def is_duplicate(self, link):
        return link in self.enriched_links

    def generate_hash_content(self,source,title,content)-> str:
        data = source + title + content
        return hashlib.sha256(
            data.encode("utf-8")
        ).hexdigest()

    async def process_message(self, msg:Msg) -> ProcessedArticle | None:
        raw_data = json.loads(msg.data.decode())
        #raw_data = json.loads(msg["data"].decode()) #Test

        link = raw_data.get("link")
        rss_date_str = raw_data.get("rss_pub_date")
        newsId = raw_data.get("newsId")

        if not link:
            self.logger.warning(
                "Article has no link",
                news_id=str(newsId),
            )
            return None

        if self.is_duplicate(link):
            self.logger.debug(
                "Duplicated article",
                news_id=str(newsId),
                link=link,
            )
            return None

        article_obj = Article(link)

        try:
            await asyncio.to_thread(article_obj.download)
            await asyncio.to_thread(article_obj.parse)
        except Exception:
            self.logger.exception(
                "Article download/parse failed",
                news_id=str(newsId),
                link=link,
            )
            raise

        title = (article_obj.title or "").strip()
        text = (article_obj.text or "").strip()

        if not text:
            self.logger.warning(
                "Article contains no extractable text",
                news_id=str(newsId),
                link=link,
            )
            return None

        if rss_date_str:
            try:
                dt_object = parsedate_to_datetime(rss_date_str)
                timestamp = int(dt_object.timestamp())
            except Exception:
                timestamp = int(datetime.now().timestamp())
        elif article_obj.publish_date:
            timestamp = int(article_obj.publish_date.timestamp())
        else:
            timestamp = int(datetime.now().timestamp())

        ext = tldextract.extract(link)
        domain_name = ext.domain.upper()

        try:
            language = detect(text[:500])
        except LangDetectException:
            self.logger.warning(
                "Unable to detect article language",
                news_id=str(newsId),
                link=link,
            )

            language = "en"


        content_hash = self.generate_hash_content(
            source=domain_name,
            title=article_obj.title,
            content=article_obj.text
        )

        self.enriched_links.add(link)

        return ProcessedArticle(
            newsId=newsId,
            title=title,
            publish_date=timestamp,
            source=domain_name,
            link=link,
            language=language,
            text=text,
            content_hash=content_hash
        )
