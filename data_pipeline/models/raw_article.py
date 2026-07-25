from pydantic import BaseModel, Field
import uuid

class RawArticle(BaseModel):
    newsId: uuid.UUID = Field(default_factory=uuid.uuid4)
    title: str
    link: str
    summary: str
    rss_pub_date: str