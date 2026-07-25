from pydantic import BaseModel
import uuid


class ProcessedArticle(BaseModel):
    newsId: uuid.UUID
    title: str
    publish_date: int
    source: str
    link: str
    language: str
    text: str
    content_hash:str
