from pydantic import BaseModel

class KeyphraseResponse(BaseModel):
    results: list[str]