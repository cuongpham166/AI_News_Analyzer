import spacy
import torch
from typing import List

from keybert import KeyBERT

from ai.analyzer.sentiment_classifier.sentiment_classifier import SentimentClassifier
from ai.analyzer.topic_classifier.topic_classifier import TopicClassifier
from ai.analyzer.news_summarizer.news_summarizer import NewsSummarizer
from ai.analyzer.entity_classifier.entity_classifier import EntityClassifier
from ai.analyzer.keyword_extractor.keyword_extractor import KeywordExtractor

from ai.responses.inference_response import InferenceResponse, InferenceResult
from ai.utils.keyword_extractor.entity_deduplicator import EntityDeduplicator
from ai.utils.keyword_extractor.entity_extractor import EntityExtractor
from ai.utils.keyword_extractor.text_normalizer import TextNormalizer


class InferenceProcessor:
    def __init__(self):
        self.entity_classifier = EntityClassifier()
        self.topic_classifier = TopicClassifier()
        self.sentiment_classifier = SentimentClassifier()
        self.news_summarizer = NewsSummarizer()

        self.spacy = spacy.load("en_core_web_sm")
        self.kw_model = KeyBERT(model="all-MiniLM-L6-v2")
        self.text_normalizer = TextNormalizer()
        self.entity_extractor = EntityExtractor(self.text_normalizer)
        self.entity_deduplicator = EntityDeduplicator()
        self.keyword_extractor = KeywordExtractor(
            spacy=self.spacy,
            kw_model=self.kw_model,
            text_normalizer=self.text_normalizer,
            entity_extractor=self.entity_extractor,
            entity_deduplicator=self.entity_deduplicator
        )

        self.device = torch.device("cpu")
        torch.set_num_threads(4)

    def get_summary_text(self, summary):
        if not summary:
            return ""

        if hasattr(summary, "results") and summary.results:
            return summary.results[0]

        return str(summary)

    def analyze(self, articles: List[dict]) -> InferenceResponse:
        texts = [a["text"] for a in articles]
        titles = [a["title"] for a in articles]

        summaries = self.news_summarizer.analyze_input(texts)

        sentiment_inputs = [
            self.get_summary_text(summaries.results[i]) if len(texts[i]) > 1000 else texts[i]
            for i in range(len(texts))
        ]
        sentiment = self.sentiment_classifier.analyze_input_onnx(sentiment_inputs)

        classification = self.topic_classifier.classify_onnx(titles)

        keyphrases = [self.keyword_extractor.extract_keywords(text=a["title"]+" "+a["text"]) for a in articles]

        ner_inputs = [
            texts[i] + " " + self.get_summary_text(summaries.results[i])
            for i in range(len(texts))
        ]

        ner = self.entity_classifier.analyze_input(ner_inputs)

        results = []

        for i in range(len(articles)):
            results.append(
                InferenceResult(
                    link=articles[i]["link"],
                    publish_date=articles[i].get("publish_date"),
                    title=articles[i]["title"],
                    source=articles[i]["source"],
                    sentiment=sentiment.results[i],
                    classification=classification.results[i],
                    ner=ner.results[i],
                    summarization=summaries.results[i],
                    language=articles[i]["language"],
                    keyphrases=keyphrases[i]

                )
            )

        return InferenceResponse(results=results)


