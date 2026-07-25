import feedparser
import asyncio
import aiohttp
import uuid

from data_pipeline.models.raw_article import RawArticle
from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class IngestionProcessor:
    def __init__(self, rss_urls):
        self.rss_urls = rss_urls
        self.seen_links = set()
        self.logger = LoggerFactory.get_logger(LoggerName.Ingestion.PROCESSOR)

    async def fetch_feed(self, session, url):
        try:
            async with session.get(url, timeout=10) as resp:
                resp.raise_for_status()
                content = await resp.read()
                self.logger.debug("RSS fetch completed")
                return feedparser.parse(content)
        except Exception as e:
            self.logger.exception("RSS fetch failed")
            return None

    async def scrape(self) -> list[RawArticle]:
        self.seen_links.clear()
        results: list[RawArticle] = []

        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch_feed(session, url) for url in self.rss_urls]
            feeds = await asyncio.gather(*tasks, return_exceptions=True)

        for feed in feeds:
            if isinstance(feed, Exception):
                self.logger.exception("Feed error")
                continue
            if not feed:
                continue
                
            for entry in feed.entries:
                link = getattr(entry, "link", "")
                if not link or link in self.seen_links:
                    continue
                self.seen_links.add(link)
                results.append(
                    RawArticle(
                        newsId=uuid.uuid4(),
                        title=getattr(entry, "title", ""),
                        link=link,
                        summary=getattr(entry, "summary", ""),
                        rss_pub_date=getattr(entry, "published", "")
                    )
                )
        return results
