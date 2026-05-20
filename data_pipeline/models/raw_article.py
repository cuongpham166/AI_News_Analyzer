from pydantic import BaseModel


class RawArticle(BaseModel):
    title: str
    link: str
    summary: str
    rss_pub_date: str
