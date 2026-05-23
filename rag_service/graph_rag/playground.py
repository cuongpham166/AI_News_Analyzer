from neo4j import GraphDatabase
from sentence_transformers import CrossEncoder

from data_pipeline.config.graph_config import get_neo4j_config
from rag_service.graph_rag.graph_rag import GrapRAG

graph_config = get_neo4j_config()
driver = GraphDatabase.driver(
    graph_config["uri"],
    auth=(graph_config["username"], graph_config["password"])
)
reranker = CrossEncoder("BAAI/bge-reranker-large")

graph_rag = GrapRAG(driver,reranker)
graph_rag.create_vector_index_if_missing()
graph_rag.create_fulltext_index()
query_a = "Analyze the current news sentiment surrounding East Jerusalem. What specific events or topics are driving the most positive vs. negative coverage for them?"

print(f"\n🚀 Running Test A: {query_a}")
response_a = graph_rag.run_graph_rag(user_query=query_a, limit=3)
print("\n[Llama 3.2 3B Analysis]:")
print(response_a)

graph_rag.close()