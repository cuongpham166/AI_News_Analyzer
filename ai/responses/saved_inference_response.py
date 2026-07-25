from pydantic import BaseModel
from uuid import UUID

from ai.responses.keyword_response import KeyphraseResponse
from ai.responses.sentiment_response import SentimentResult
from ai.responses.classification_response import ClassificationResult
from ai.responses.ner_response import NerResult


class SavedInferenceResponse(BaseModel):
    newsId: UUID
    link: str
    publish_date: int
    language: str
    title: str
    source: str
    content_hash: str
    sentiment: SentimentResult
    classification: ClassificationResult
    ner: NerResult
    summarization: str
    keyphrases:KeyphraseResponse