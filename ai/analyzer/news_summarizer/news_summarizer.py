from typing import List, Dict
import time
import numpy as np
import torch

from transformers import AutoTokenizer, BartForConditionalGeneration

from ai.tokenizer.summarization.summarization_tokenizer import SummarizationTokenizer
from ai.responses.summarization_response import SummarizationResponse

from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

pytorch_model_dir = "ai/models/summarization/pytorch"
local_dir = "ai/models/summarization/pytorch"


class NewsSummarizer:
    def __init__(self):
        self.model = BartForConditionalGeneration.from_pretrained(pytorch_model_dir, local_files_only=True)
        self.device = torch.device("cpu")
        self.model.to(self.device)
        self.model.eval()
        self.summarization_tokenizer = SummarizationTokenizer(pytorch_model_dir)
        self.logger = LoggerFactory.get_logger(LoggerName.Inference.SUMMARY)

    def save(self):
        self.model.save_pretrained(local_dir)
        self.summarization_tokenizer.save(local_dir)

    def summarize_ids(self, tokenized_inputs):
        summary_ids = self.model.generate(
            tokenized_inputs["input_ids"],
            attention_mask=tokenized_inputs.get("attention_mask"),
            num_beams=4,
            max_length=120,
            min_length=30,
            length_penalty=2.0,
            no_repeat_ngram_size=3,
            repetition_penalty=1.2,
            early_stopping=True
        )
        return summary_ids

    def analyze_input(self, articles: List[str], newsId) -> SummarizationResponse:
        start = time.perf_counter()

        tokenize_start = time.perf_counter()

        tokenized_inputs = self.summarization_tokenizer.encode(articles)
        tokenized_inputs = {k: v.to(self.device) for k, v in tokenized_inputs.items()}

        tokenize_ms = (time.perf_counter() - tokenize_start) * 1000

        inference_start = time.perf_counter()

        summary_ids = self.summarize_ids(tokenized_inputs)
        summaries = self.summarization_tokenizer.batch_decode(summary_ids)

        inference_ms = (time.perf_counter() - inference_start) * 1000

        total_ms = (time.perf_counter() - start) * 1000

        self.logger.debug(
            "Summarization with PyTorch completed",
            news_id=newsId,
            tokenize_ms=round(tokenize_ms, 2),
            inference_ms=round(inference_ms, 2),
            total_ms=round(total_ms, 2),
        )

        return SummarizationResponse(results=summaries)
