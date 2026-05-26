from elasticsearch import Elasticsearch

from data_pipeline.config.indexing_config import get_elasticsearch_config
from rag_service.search_rag.search_rag import SearchRAG

elastic_config = get_elasticsearch_config()
es_client = Elasticsearch(elastic_config["elastic_url"])

search_rag = SearchRAG(es_client)
test_query = "East Jerusalem sentiment"
test_window = "24h"
result = search_rag.search_elasticsearch(user_query=test_query,time_window=test_window)
print("SearchRAG: ", result)