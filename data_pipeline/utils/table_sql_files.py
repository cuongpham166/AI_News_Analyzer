from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()
creation_query_folder_path = os.getenv("SQL_CREATION_QUERY_FOLDER_PATH")
getter_query_folder_path = os.getenv("SQL_GETTER_QUERY_FOLDER_PATH")

TABLE_SQL_CREATION_FILES = {
    "entity": "create_entity_table.sql",
    "entity_type": "create_entity_type_table.sql",
    "inference_news_entity": "create_inference_news_entity_table.sql",
    "inference_news_keyphrase": "create_inference_news_keyphrase_table.sql",
    "inference_news": "create_inference_news_table.sql",
    "keyphrase": "create_keyphrase_table.sql",
    "news_bookmark": "create_news_bookmark_table.sql",
    "news_reaction": "create_news_reaction_table.sql",
    "news": "create_news_table.sql",
    "source": "create_source_table.sql",
    "topic": "create_topic_table.sql",
}

def get_creation_query(table_name: str) -> Path:
    sql_file = Path(creation_query_folder_path) / f"create_{table_name}_table.sql"
    if not sql_file.is_file():
        raise ValueError(f"Unknown table: {table_name}")
    return sql_file

def get_getter_query(table_name: str) -> Path:
    sql_file = Path(getter_query_folder_path) / f"get_{table_name}_table.sql"
    if not sql_file.is_file():
        raise ValueError(f"Unknown table: {table_name}")
    return sql_file