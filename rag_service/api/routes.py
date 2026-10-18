from fastapi import APIRouter, Depends
from pydantic import BaseModel

from rag_service.services.rag_service import RAGService
from rag_service.api.dependencies import get_rag_service
from rag_service.schemas.schemas import (ChatRequest,ChatResponse)

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok"}


@router.get("/")
async def root():
    return {"message": "Hello World"}

@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    rag_service: RAGService = Depends(get_rag_service),
) -> ChatResponse:
    answer = rag_service.run_rag_service(
        user_query=request.prompt,
        time_window="12M",
        limit=3,
    )

    return ChatResponse(answer=answer)