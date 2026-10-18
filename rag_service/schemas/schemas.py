from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    prompt: str = Field(
        ...,
        description="The prompt for the chat",
        min_length=1,
        max_length=100000,
    )

class ChatResponse(BaseModel):
    answer: str