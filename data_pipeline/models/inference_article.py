from datetime import datetime
from pydantic import BaseModel, HttpUrl,field_validator
from typing import List
from uuid import UUID

class Entity(BaseModel):
    id: str
    name: str

class Person(Entity):
    pass

class Organization(Entity):
    pass

class Location(Entity):
    pass

class Event(Entity):
    pass

class Source(BaseModel):
    name: str

class Topic(BaseModel):
    name: str

class Keyphrase(BaseModel):
    name: str

class News(BaseModel):
    link: str
    title: str
    publish_date: datetime
    sentiment: float
    summary: str
    language: str
    newsId: UUID
    content_hash: str

    @field_validator("sentiment")
    def validate_sentiment(cls,value):
        if value < -1 or value > 1:
            raise ValueError("Sentiment must be between -1 and 1")
        return value

class Entities(BaseModel):
    persons: List[Person] = []
    organizations: List[Organization] = []
    locations: List[Location] = []
    events: List[Event] = []

class InferenceArticle(BaseModel):
    source: Source
    topic: Topic
    news: News
    entities: Entities
    keyphrases: list[str] = []