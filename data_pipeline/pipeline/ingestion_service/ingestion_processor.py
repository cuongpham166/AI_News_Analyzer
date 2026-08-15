import feedparser
import asyncio
import aiohttp
import uuid

from data_pipeline.models.raw_article import RawArticle
from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName
from data_pipeline.models.article_candidate import ArticleCandidate

class IngestionProcessor:
    def __init__(self, rss_urls):
        self.rss_urls = rss_urls
        #self.logger = LoggerFactory.get_logger(LoggerName.Ingestion.PROCESSOR)

    async def fetch_feed(
            self,
            session,
            url
    ):
        try:
            async with session.get(
                    url,
                    timeout=aiohttp.ClientTimeout(total=10),
            ) as resp:
                resp.raise_for_status()
                content = await resp.read()
                #self.logger.debug("RSS fetch completed")
                return feedparser.parse(content)
        except Exception as e:
            #self.logger.exception("RSS fetch failed")
            return None

    async def scrape(self) -> list[ArticleCandidate]:
        results: list[ArticleCandidate] = []
        seen_links: set[str] = set()

        async with aiohttp.ClientSession() as session:
            tasks = [
                self.fetch_feed(session, url)
                for url in self.rss_urls
            ]

            feeds = await asyncio.gather(
                *tasks,
                return_exceptions=True,
            )

        for feed in feeds:
            if isinstance(feed, Exception):
                continue

            if not feed:
                continue

            for entry in feed.entries:
                link = getattr(entry, "link", "")

                if not link:
                    continue

                if link in seen_links:
                    continue

                seen_links.add(link)

                results.append(
                    ArticleCandidate(
                        title=getattr(entry,"title",""),
                        link=link,
                        summary=getattr(entry,"summary",""),
                        rss_pub_date=getattr(entry,"published",""),
                    )
                )
        return results