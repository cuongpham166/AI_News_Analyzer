import json

import psycopg
from elasticsearch import Elasticsearch, exceptions
import os
from dotenv import load_dotenv

from data_pipeline.config.article_config import get_postgres_config
from data_pipeline.config.indexing_config import get_elasticsearch_config
from data_pipeline.pipeline.article_service.article_repository import ArticleRepository
from data_pipeline.utils.indexing_repository_utils import transform_document

load_dotenv()
query_folder_path = os.getenv("ELASTIC_SCRIPT_PATH")
root_folder = query_folder_path

sql_query_folder_path = os.getenv("SQL_QUERY_FOLDER_PATH")
sql_root_folder = sql_query_folder_path


class IndexingRepository:
    def __init__(self, es_client):
        self.es_client = es_client

    def check_connection(self):
        print("Check connection: ", self.es_client.info())

    def create_index(self, index_name: str, mapping: dict):
        if not self.es_client.indices.exists(index=index_name):
            self.es_client.indices.create(
                index=index_name,
                mappings=mapping["mappings"]
            )
            print(f"Index '{index_name}' created")
        else:
            print(f"Index '{index_name}' already exists")

    def create_news_index(self):
        index_name = "news"
        elastic_file = root_folder + "news_mappings.json"
        with open(elastic_file, "r") as f:
            news_mapping = json.load(f)
        self.create_index(index_name, news_mapping)

    def index_news_document(self, document):
        transformed_document = transform_document(document)
        doc_id = transformed_document['link']
        try:
            self.es_client.index(index="news", id=doc_id, document=transformed_document)
        except exceptions.ConflictError:
            print("Document already exists, skipping insertion")

    def get_all_news_documents(self):
        news_documents = []
        response = self.es_client.search(index="news", query={"match_all": {}})
        for hit in response['hits']['hits']:
            news_documents.append(hit["_source"])
        return news_documents

    def get_news_documents(self, link: str):
        response = self.es_client.get(index="news", id=link)
        return response["_source"]

    def delete_news_document(self, link: str):
        try:
            self.es_client.delete(index="news", id=link)
        except Exception as e:
            print("Error deleting document: ", e)

    def get_all_links(self):
        links = []

        resp = self.es_client.search(
            index="news",
            scroll="1m",
            size=1000,
            _source=["link"],
            body={
                "query": {"match_all": {}}
            }
        )

        scroll_id = resp["_scroll_id"]
        hits = resp["hits"]["hits"]

        while hits:
            for h in hits:
                if "link" in h["_source"]:
                    links.append(h["_source"]["link"])

            resp = self.es_client.scroll(scroll_id=scroll_id, scroll="1m")
            scroll_id = resp["_scroll_id"]
            hits = resp["hits"]["hits"]

        return links


    def update_full_text_by_link(self,link: str, full_text: str):
        if not full_text:
            return

        response = self.es_client.update_by_query(
            index="news",
            refresh=True,
            body={
                "script": {
                    "source": "ctx._source.full_text = params.full_text",
                    "params": {
                        "full_text": full_text
                    }
                },
                "query": {
                    "term": {
                        "link": link.strip()
                    }
                }
            }
        )

        print(f"Updated documents: {response['updated']}")
        return response

    def update_full_text(self):
        config = get_postgres_config()
        conn = psycopg.connect(**config)
        article_repo = ArticleRepository(conn)
        document_links = indexing_repo.get_all_links()

        for link in document_links:
            full_text = article_repo.get_fulltext_by_link(link)
            self.update_full_text_by_link(link,full_text)



if __name__ == "__main__":
    elastic_config = get_elasticsearch_config()
    es_client = Elasticsearch(elastic_config["elastic_url"])
    indexing_repo = IndexingRepository(es_client)