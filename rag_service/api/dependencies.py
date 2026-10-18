from fastapi import Request
from rag_service.services.rag_service import RAGService

def get_rag_service(request: Request) -> RAGService:
    return request.app.state.rag_service