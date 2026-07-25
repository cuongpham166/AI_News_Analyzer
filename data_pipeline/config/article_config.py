import os
from dotenv import load_dotenv

load_dotenv()

def get_postgres_config():
    postgres_host = os.getenv("POSTGRES_HOST")
    postgres_port = os.getenv("POSTGRES_PORT")
    postgres_dbname = os.getenv("POSTGRES_DB")
    postgres_user = os.getenv("POSTGRES_USER")
    postgres_password = os.getenv("POSTGRES_PASSWORD")

    conn_params = {
        "host": postgres_host,
        "port": postgres_port,
        "dbname": postgres_dbname,
        "user": postgres_user,
        "password": postgres_password
    }

    return conn_params

def get_topics():
    topic_labels = ["economy","entertainment","health","politics","science","sports", "technology","world"]
    return topic_labels

def get_entity_types():
    entity_types = ["person", "organization", "location", "event"]
    return entity_types

def get_table_name():
    table_names = [
        "source",
        "entity_type",
        "entity",
        "news",
        "topic",
        "keyphrase",
        "inference_news",
        "inference_news_entity",
        "inference_news_keyphrase",
        "news_reaction",
        "news_bookmark"
    ]
    return table_names
