from contextlib import asynccontextmanager

from fastapi import FastAPI
from elasticsearch import Elasticsearch
from neo4j import GraphDatabase
from sentence_transformers import CrossEncoder

from rag_service.core.config import (get_neo4j_config, get_elasticsearch_config)
from rag_service.services.graph_rag.graph_rag import GrapRAG
from rag_service.services.search_rag.search_rag import SearchRAG
from rag_service.services.rag_service import RAGService

@asynccontextmanager
async def lifespan(app: FastAPI):
    graph_config = get_neo4j_config()

    driver = GraphDatabase.driver(
        graph_config["uri"],
        auth=(
            graph_config["username"],
            graph_config["password"],
        ),
    )

    elastic_config = get_elasticsearch_config()
    es_client = Elasticsearch(
        elastic_config["elastic_url"]
    )

    reranker = CrossEncoder("BAAI/bge-reranker-large")

    graph_rag = GrapRAG(driver, reranker)
    search_rag = SearchRAG(es_client)

    rag_service = RAGService(
        graph_rag,
        search_rag,
        reranker,
    )

    app.state.rag_service = rag_service
    app.state.neo4j_driver = driver
    app.state.es_client = es_client

    try:
        yield
    finally:
        driver.close()
        es_client.close()