from datetime import datetime
from pydantic import BaseModel, HttpUrl,field_validator
from typing import List

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

class News(BaseModel):
    link: str
    title: str
    publish_date: datetime
    sentiment: float
    summary: str
    language: str

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

article_data = {
    "source": {
        "name": "BBC"
    },

    "topic": {
        "name": "Artificial Intelligence"
    },

    "news": {
        "link": "https://example.com/news1",
        "title": "OpenAI conference in Berlin",
        "publish_date": "2026-05-19T10:30:00Z",
        "sentiment": 0.82,
        "language": "en"
    },

    "entities": {
        "persons": [
            {"id": "sam_altman", "name": "Sam Altman"}
        ],

        "organizations": [
            {"id": "openai", "name": "OpenAI"},
            {"id": "microsoft", "name": "Microsoft"}
        ],

        "locations": [
            {"id": "berlin_de", "name": "Berlin"},
            {"id": "germany", "name": "Germany"}
        ],

        "events": [
            {"id": "openai_dev_summit_2026", "name": "OpenAI Dev Summit"}
        ]
    }
}