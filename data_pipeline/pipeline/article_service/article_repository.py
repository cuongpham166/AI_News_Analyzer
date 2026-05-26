import psycopg
import os
from dotenv import load_dotenv
from data_pipeline.config.article_config import get_topics,get_entity_types,get_postgres_config

load_dotenv()
query_folder_path = os.getenv("SQL_QUERY_FOLDER_PATH")

root_folder = query_folder_path

class ArticleRepository:
    def __init__(self, conn):
        self.conn = conn

    def rollback(self):
        self.conn.rollback()

    def check_connection(self):
        try:
            with self.conn.cursor() as cur:
                cur.execute("SELECT 1;")
                result = cur.fetchone()
                if result:
                    print("Connection successful! Result:", result[0])
                else:
                    print("Connection made, but no result returned.")
        except psycopg.Error as e:
            print("Unable to connect to the database")
            print("Error:", e)

    def run_init_configs(self):
        topic_labels = get_topics()
        entity_types = get_entity_types()

        self.create_source_table()
        self.create_topic_table()
        self.create_entity_type_table()
        self.create_news_table()
        self.create_entity_table()
        self.create_news_entity_table()

        self.insert_topic_data(topic_labels)
        self.insert_entity_type_data(entity_types)

    def create_entity_type_table(self):
        try:
            sql_file = f"{root_folder}create_entity_type_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)

    def create_entity_table(self):
        try:
            sql_file = f"{root_folder}create_entity_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)

    def create_source_table(self):
        try:
            sql_file = f"{root_folder}create_source_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)

    def create_topic_table(self):
        try:
            sql_file = f"{root_folder}create_topic_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)

    def create_news_table(self):
        try:
            sql_file = f"{root_folder}create_news_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)

    def create_news_entity_table(self):
        try:
            sql_file = f"{root_folder}create_news_entity_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql)
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)

    def insert_entity_type_data(self, entity_types):
        try:
            sql_file = f"{root_folder}insert_entity_type_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.executemany(sql, [(et,) for et in entity_types])
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    def insert_entity_data(self, news_entities):
        try:
            if len(news_entities) > 0:
                sql_file = f"{root_folder}insert_entity_table.sql"
                with open(sql_file, "r") as f:
                    sql = f.read()
                with self.conn.cursor() as cur:
                    for entity in news_entities:
                        cur.execute(sql, (entity["value"], entity["type"]))
                    self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    def insert_source_data(self, sources):
        try:
            sql_file = f"{root_folder}insert_source_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.executemany(sql, [(source,) for source in sources])
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    def insert_topic_data(self, topics):
        try:
            sql_file = f"{root_folder}insert_topic_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.executemany(sql, [(topic,) for topic in topics])
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    def insert_news_data(self, news):
        try:
            self.insert_source_data([news["source"]])
            sql_file = f"{root_folder}insert_news_table.sql"
            #publish_date = news["publish_date"]
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql,
                            (news["title"], news["publish_date"], news["link"], news["language"], news["text"], news["source"]))
                row = cur.fetchone()
                if row is not None:
                    new_id = row[0]
                else:
                    new_id = -1
            self.conn.commit()
            return new_id
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    def insert_news_entity_data(self, news_link, news_entity):
        try:
            sql_file = f"{root_folder}insert_news_entity_table.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql, (news_link, news_entity))
            self.conn.commit()
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    # insert entity_type => insert entity => update_news with AI results => insert_news_entity
    # insert entity => update news => insert_news_entity
    def update_news_data(self, updated_data):
        try:
            news_entities = updated_data["ner"]["entities"]
            self.insert_entity_data(news_entities)

            sql_file = f"{root_folder}update_news_table.sql"
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
                self.insert_news_entity_data(updated_data["link"], entity_element)
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()

    def fetch_all_data(self, table_name):
        match table_name:
            case "entity_type":
                sql_file = f"{root_folder}get_entity_type_table.sql"
            case "entity":
                sql_file = f"{root_folder}get_entity_table.sql"
            case "news_source":
                sql_file = f"{root_folder}get_source_table.sql"
            case "topic":
                sql_file = f"{root_folder}get_topic_table.sql"
            case "news":
                sql_file = f"{root_folder}get_news_table.sql"
            case _:
                sql_file = f"{root_folder}get_entity_type_table.sql"

        with open(sql_file, "r") as f:
            sql = f.read()

        with self.conn.cursor() as cur:
            cur.execute(sql)
            return cur.fetchall()

    def fetch_missing_data(self):
        sql_file = f"{root_folder}get_missing_data_news.sql"
        with open(sql_file, "r") as f:
            sql = f.read()
        with self.conn.cursor() as cur:
            cur.execute(sql)
            return cur.fetchall()

    def get_fulltext_by_link(self, link):
        try:
            sql_file = f"{root_folder}get_full_text.sql"
            with open(sql_file, "r") as f:
                sql = f.read()
            with self.conn.cursor() as cur:
                cur.execute(sql,(link,))
                row = cur.fetchone()
                return row[0]
        except psycopg.Error as e:
            print("Error", e)
            self.conn.rollback()