import json
import uuid
import os

from dotenv import load_dotenv

import psycopg

from data_pipeline.models.article_candidate import ArticleCandidate
from data_pipeline.models.raw_article import RawArticle
from data_pipeline.utils.url_utils import canonicalize_url
from data_pipeline.utils.table_sql_files import get_getter_query,get_creation_query

load_dotenv()
insertion_query_folder_path = os.getenv("SQL_INSERTION_QUERY_FOLDER_PATH")

class IngestionRepository:
    def __init__(self, conn):
        self.conn = conn

    def register_article(self,candidate:ArticleCandidate) -> bool:
        canonical_url = canonicalize_url(candidate.link)
        news_id = uuid.uuid4()
        event_id = uuid.uuid4()

        raw_article = RawArticle(
            newsId=news_id,
            title=candidate.title,
            link=canonical_url,
            summary=candidate.summary,
            rss_pub_date=candidate.rss_pub_date,
        )

        payload = raw_article.model_dump(
            mode="json"
        )

        try:
            news_identity_file = f"{insertion_query_folder_path}insert_news_identity_table.sql"
            outbox_events_file = f"{insertion_query_folder_path}insert_outbox_events_table.sql"

            with open(news_identity_file, "r") as f:
                news_identity_sql = f.read()

            with open(outbox_events_file, "r") as f:
                outbox_events_sql = f.read()

            with self.conn.cursor() as cur:
                cur.execute(news_identity_sql,(news_id,canonical_url))

                result = cur.fetchone()

                if result is None:
                    #self.logger.debug("Article already exists",link=canonical_url)
                    return False

                cur.execute(outbox_events_sql,(event_id,news_id,"article.raw",json.dumps(payload)))

                self.conn.commit()
                #self.logger.info("Article registered", news_id=str(article_id),link=canonical_url)
                return True


        except psycopg.Error as e:
            self.conn.rollback()
            """
            self.logger.exception(
                "Unable to register article",
                error=str(e),
            )
            """
            #self.logger.exception("Unable to insert new entity type")
            return False