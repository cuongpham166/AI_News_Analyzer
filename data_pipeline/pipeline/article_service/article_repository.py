import psycopg
import os
from dotenv import load_dotenv
from data_pipeline.config.article_config import get_topics,get_entity_types,get_postgres_config
from data_pipeline.utils.table_sql_files import get_creation_query, get_getter_query
load_dotenv()

creation_query_folder_path = os.getenv("SQL_CREATION_QUERY_FOLDER_PATH")
getter_query_folder_path = os.getenv("SQL_GETTER_QUERY_FOLDER_PATH")
insertion_query_folder_path = os.getenv("SQL_INSERTION_QUERY_FOLDER_PATH")
update_query_folder_path = os.getenv("SQL_UPDATE_QUERY_FOLDER_PATH")

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class ArticleRepository:
    def __init__(self, conn):
        self.conn = conn
        self.logger = LoggerFactory.get_logger(LoggerName.Article.REPOSITORY)

    def rollback(self):
        self.conn.rollback()

    def check_connection(self) -> bool:
        try:
            with self.conn.cursor() as cur:
                cur.execute("SELECT 1;")
                result = cur.fetchone()
                if result:
                    self.logger.info("Connected to the database.")
                    return True
                self.logger.exception("Unable to connect to the database.")
                return False
        except psycopg.Error as e:
            self.logger.exception("Unable to connect to the database.")
            return False

    def create_table(self, table_name):
        try:
            sql_file = get_creation_query(table_name)
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
            self.conn.commit()
        except psycopg.Error as e:
            self.logger.exception(f"Unable to create {table_name} table")

    def insert_entity_type(self, entity_types):
        try:
            sql_file = f"{insertion_query_folder_path}insert_entity_type_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.executemany(sql, [(et,) for et in entity_types])
            self.conn.commit()
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new entity type")
            self.conn.rollback()

    def insert_entity(self, news_entities):
        try:
            if len(news_entities) > 0:
                sql_file = f"{insertion_query_folder_path}insert_entity_table.sql"
                with open(sql_file, "r") as f:
                    sql = f.read()
                with self.conn.cursor() as cur:
                    for entity in news_entities:
                        cur.execute(sql, (entity["value"], entity["type"]))
                    self.conn.commit()
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new entity")
            self.conn.rollback()

    def insert_source(self, sources):
        try:
            sql_file = f"{insertion_query_folder_path}insert_source_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.executemany(sql, [(source,) for source in sources])
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new source")


    def insert_topic_data(self, topics):
        try:
            sql_file = f"{insertion_query_folder_path}insert_topic_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.executemany(sql, [(topic,) for topic in topics])
            self.conn.commit()
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new topic")
            self.conn.rollback()

    def insert_news(self, news):
        try:
            self.insert_source([news["source"]])

            sql_file = f"{insertion_query_folder_path}insert_news_table.sql"

            with open(sql_file, "r") as f:
                sql = f.read()

            with self.conn.cursor() as cur:
                cur.execute(sql,
                            (news["newsId"],
                             news["title"],
                             news["publish_date"],
                             news["link"],
                             news["language"],
                             news["text"],
                             news["content_hash"],
                             news["source"])
                            )
                row = cur.fetchone()

                if row is None:
                    cur.execute(
                        """
                        SELECT id
                        FROM news
                        WHERE link = %s
                        """,
                        (news["link"],),
                    )

                    result = cur.fetchone()

                    if result is None:
                        raise RuntimeError(
                            f"News not found after insert: "
                            f"{news['link']}"
                        )

                    news_id = result[0]
                else:
                    news_id = row[0]
            self.conn.commit()
            return news_id
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new news")
            self.conn.rollback()
            return None

    def insert_inference_news_entity(self, news_id, news_entity):
        try:
            sql_file = f"{insertion_query_folder_path}insert_inference_news_entity_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql, (news_id, news_entity))
            self.conn.commit()
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new inference news entity")
            self.conn.rollback()

    def insert_inference_news_keyphrase(self, news_id,keyphrase):
        try:
            sql_file = f"{insertion_query_folder_path}insert_inference_news_keyphrase_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql, (news_id, keyphrase))
            self.conn.commit()
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new inference news keyphrase")
            self.conn.rollback()


    def insert_keyphrase(self, keyphrases):
        try:
            sql_file = f"{insertion_query_folder_path}insert_keyphrase_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.executemany(sql, [(keyphrase,) for keyphrase in keyphrases])
            self.conn.commit()
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new keyphrase")
            self.conn.rollback()


    def insert_inference_news(self, inference_news):
        try:
            news_entities = inference_news["ner"]["entities"]
            keyphrases = inference_news["keyphrases"]["results"]
            entities_list = [entity["value"] for entity in inference_news["ner"]["entities"]]
            keyphrases_list = [keyphrase for keyphrase in inference_news["keyphrases"]["results"]]

            self.insert_entity(news_entities)

            self.insert_keyphrase(keyphrases)

            sql_file = f"{insertion_query_folder_path}insert_inference_news_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(
                    "SELECT id FROM news WHERE id = %s",
                    (inference_news["newsId"],)
                )
                print(cur.fetchone())

                cur.execute(sql, (
                    inference_news["summarization"],
                    inference_news["sentiment"]["label"],
                    inference_news["sentiment"]["score"],
                    inference_news["classification"]["topic"],
                    inference_news["newsId"]
                ))
            self.conn.commit()

            for entity_element in entities_list:
                self.insert_inference_news_entity(news_id=inference_news["newsId"], news_entity=entity_element)

            for keyphrase_element in keyphrases_list:
                self.insert_inference_news_keyphrase(news_id=inference_news["newsId"], keyphrase=keyphrase_element)

            return True
        except psycopg.Error as e:
            self.logger.exception("Unable to insert new inference news")
            self.conn.rollback()
            return False


    # insert entity_type => insert entity => update_news with AI results => insert_news_entity
    # insert entity => update news => insert_news_entity
    def update_news_data(self, updated_data):
        try:
            news_entities = updated_data["ner"]["entities"]
            self.insert_entity_data(news_entities)

            sql_file = f"{update_query_folder_path}update_news_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql, (
                    updated_data["link"],
                    updated_data["summarization"],
                    updated_data["sentiment"]["label"],
                    updated_data["sentiment"]["score"],
                    updated_data["classification"]["topic"]
                ))
            self.conn.commit()

            entities_list = [entity["value"] for entity in updated_data["ner"]["entities"]]

            for entity_element in entities_list:
                self.insert_news_entity(updated_data["link"], entity_element)
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()


    def fetch_all_data(self, table_name):
        try:
            sql_file = get_getter_query(table_name)
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
                return cur.fetchall()
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    def fetch_missing_data(self):
        sql_file = f"{getter_query_folder_path}get_missing_data_news.sql"
        with open(sql_file, "r") as f:
            sql = f.read()
        with self.conn.cursor() as cur:
            cur.execute(sql)
            return cur.fetchall()

    def get_fulltext_by_link(self, link):
        try:
            sql_file = f"{getter_query_folder_path}get_full_text.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql,(link,))
                row = cur.fetchone()
                return row[0]
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()