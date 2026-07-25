from typing import List
import torch
import onnxruntime as ort
import time

from transformers import AutoTokenizer, AutoModelForSequenceClassification
from ai.tokenizer.classification.classifier_tokenizer import ClassifierTokenizer
from ai.responses.classification_response import ClassificationResponse, ClassificationResult
from ai.config.labels.topic_labels import TopicLabel

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

pytorch_model_dir = "ai/models/topic_classifier/pytorch"
local_dir = "ai/models/topic_classifier/pytorch"

int8_onnx_model_dir = "ai/models/topic_classifier/int8_onnx"
int8_onnx_model_path = "ai/models/topic_classifier/int8_onnx/model_int8.onnx"

class TopicClassifier:
    def __init__(self):
        self.model = AutoModelForSequenceClassification.from_pretrained(pytorch_model_dir, local_files_only=True)
        self.device = torch.device("cpu")
        self.model.to(self.device)
        self.model.eval()
        self.classifier_tokenizer = ClassifierTokenizer(pytorch_model_dir)
        self.topic_labels = TopicLabel()

        self.session = ort.InferenceSession(int8_onnx_model_path, providers=['CPUExecutionProvider'])
        self.classifier_tokenizer_int8 = ClassifierTokenizer(int8_onnx_model_dir)
        self.logger = LoggerFactory.get_logger(LoggerName.Inference.TOPIC)

    def classify(self, articles: List[str],newsId) -> ClassificationResponse:
        start = time.perf_counter()

        tokenize_start = time.perf_counter()
        tokenized_inputs = self.classifier_tokenizer.encode(articles).to(self.device)
        tokenize_ms = (time.perf_counter() - tokenize_start) * 1000

        inference_start = time.perf_counter()
        with torch.no_grad():
            output = self.model(**tokenized_inputs)
            logits = output.logits
        inference_ms = (time.perf_counter() - inference_start) * 1000

        post_start = time.perf_counter()

        prediction_ids = logits.argmax(dim=-1)

        results = []
        for i in range(len(articles)):
            topic_id = prediction_ids[i].item()
            topic_label = self.topic_labels.id2label(topic_id)
            results.append(
                ClassificationResult(
                    topic=topic_label
                )
            )

        post_ms = (time.perf_counter() - post_start) * 1000
        total_ms = (time.perf_counter() - start) * 1000

        self.logger.debug(
            "Topic classification with PyTorch completed",
            news_id=newsId,
            tokenize_ms=round(tokenize_ms, 2),
            inference_ms=round(inference_ms, 2),
            postprocess_ms=round(post_ms, 2),
            total_ms=round(total_ms, 2),
        )

        return ClassificationResponse(results=results)

    def classify_onnx(self, articles: List[str],newsId) -> ClassificationResponse:
        start = time.perf_counter()

        tokenize_start = time.perf_counter()
        tokenized_inputs = self.classifier_tokenizer_int8.encode(articles)
        tokenize_ms = (time.perf_counter() - tokenize_start) * 1000

        inference_start = time.perf_counter()
        ort_inputs = {
            "input_ids": tokenized_inputs["input_ids"].numpy(),
            "attention_mask": tokenized_inputs["attention_mask"].numpy()
        }
        logits = self.session.run(None, ort_inputs)[0]
        inference_ms = (time.perf_counter() - inference_start) * 1000

        post_start = time.perf_counter()
        results = []
        for i in range(len(articles)):
            prediction_ids = logits[i].argmax(axis=-1)
            topic_id = prediction_ids.item()
            topic_label = self.topic_labels.id2label(topic_id)
            results.append(
                ClassificationResult(
                    topic=topic_label
                )
            )

        post_ms = (time.perf_counter() - post_start) * 1000
        total_ms = (time.perf_counter() - start) * 1000

        self.logger.debug(
            "Topic classification with ONNX completed",
            news_id=newsId,
            tokenize_ms=round(tokenize_ms, 2),
            inference_ms=round(inference_ms, 2),
            postprocess_ms=round(post_ms, 2),
            total_ms=round(total_ms, 2),
        )

        return ClassificationResponse(results=results)