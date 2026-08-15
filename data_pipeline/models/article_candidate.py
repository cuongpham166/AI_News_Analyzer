from pydantic import BaseModel, Field
import uuid

class ArticleCandidate(BaseModel):
    title: str
    link: str
    summary: str
    rss_pub_date: str