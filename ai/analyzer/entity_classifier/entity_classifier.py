from typing import List, Dict
import time
import torch
from gliner import GLiNER
from ai.responses.ner_response import NerResponse, NerResult, NerEntity

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

pytorch_model_dir = 'ai/models/ner/pytorch'

class EntityClassifier:
    def __init__(self):
        self.model = GLiNER.from_pretrained(pytorch_model_dir, local_files_only=True)
        self.device = torch.device("cpu")
        self.model.to(self.device)
        self.model.eval()
        self.logger = LoggerFactory.get_logger(LoggerName.Inference.ENTITY)

    def save(self):
        self.model.save_pretrained("ai/models/ner/pytorch")

    def analyze_input(self, articles: List[str],newsId) -> NerResponse:
        inference_start = time.perf_counter()
        prediction_result = []
        entity_types = ["person", "organization", "location", "event"]
        for article in articles:
            MAX_CHARS = 800
            article = article[:MAX_CHARS]

            ner_entities = []
            entities = self.model.predict_entities(article, entity_types, threshold=0.3)
            for entity in entities:
                ner_entities.append(
                    NerEntity(
                        value=entity["text"],
                        type=entity["label"]
                    )
                )

            prediction_result.append(
                NerResult(
                    entities=ner_entities
                )
            )
        inference_ms = (time.perf_counter() - inference_start) * 1000

        self.logger.debug(
            "Entity classification with PyTorch completed",
            news_id=newsId,
            inference_ms=round(inference_ms, 2),
            entites=len(prediction_result)
        )

        return NerResponse(results=prediction_result)
