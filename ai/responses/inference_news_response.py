from pydantic import BaseModel

from ai.responses.ner_response import NerEntity


class InferenceNewsResponse(BaseModel):
    link: str
    publish_date: int
    title: str
    source: str
    sentiment_label: str
    sentiment: float
    topic: str
    entities: list[NerEntity]
    summary: str
