from rag_service.graph_rag.graph_rag import GrapRAG

graph_rag = GrapRAG()
local_embedding = graph_rag.get_local_embedding("This is the example input")
print("local_embedding: ",local_embedding)