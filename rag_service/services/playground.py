from elasticsearch import Elasticsearch
from neo4j import GraphDatabase
from sentence_transformers import CrossEncoder

from data_pipeline.config.graph_config import get_neo4j_config
from data_pipeline.config.indexing_config import get_elasticsearch_config
from rag_service.services.graph_rag.graph_rag import GrapRAG
from rag_service.services.search_rag.search_rag import SearchRAG

graph_config = get_neo4j_config()
driver = GraphDatabase.driver(
    graph_config["uri"],
    auth=(graph_config["username"], graph_config["password"])
)

reranker = CrossEncoder("BAAI/bge-reranker-large")

elastic_config = get_elasticsearch_config()
es_client = Elasticsearch(elastic_config["elastic_url"])

graph_rag = GrapRAG(driver, reranker)
search_rag = SearchRAG(es_client)

#test_query = "Analyze the security implications regarding the UNRWA compound incident in East Jerusalem over the last 24 hours. Who are the key organizations and people tied to this development?"
test_query = "Analyze the main security issues over the last 6 months. Give me a compact summary?"
rag_service = RAGService(graph_rag,search_rag,reranker)
rag_service.run_rag_service(test_query)