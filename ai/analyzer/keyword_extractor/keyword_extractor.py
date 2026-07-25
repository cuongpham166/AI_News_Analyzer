import time

from keyphrase_vectorizers import KeyphraseCountVectorizer
from ai.responses.keyword_response import KeyphraseResponse
from data_pipeline.logger.logger_factory import LoggerFactory
from data_pipeline.logger.logger_names import LoggerName

class KeywordExtractor:
    def __init__(
            self,
            spacy,
            kw_model,
            text_normalizer,
            entity_extractor,
            entity_deduplicator,
            top_n=10
    ):
        self.spacy_processor = spacy
        self.kw_model = kw_model
        self.text_normalizer = text_normalizer
        self.entity_extractor = entity_extractor
        self.entity_deduplicator = entity_deduplicator
        self.top_n = top_n
        self.logger = LoggerFactory.get_logger(LoggerName.Inference.KEYWORD)

    def entity_score(self, label, text):
        base = {
            "ORG": 0.22,
            "GPE": 0.18,
            "LOC": 0.18,
            "FAC": 0.18,
            "EVENT": 0.16,
            "PERSON": 0.12,
            "NORP": 0.10,
        }.get(label, 0.10)

        base += min(len(text.split()) * 0.03, 0.12)

        return round(base, 4)

    def extract_keywords(self, newsId, text):
        total_start = time.perf_counter()

        STOP_PHRASES = {"vast majority","metric tonnes", "disruptions"}
        STOP_WORDS = {"people","risk","route","march","april"}

        start = time.perf_counter()
        text = self.text_normalizer.clean(text)
        normalize_ms = (time.perf_counter() - start) * 1000

        start = time.perf_counter()
        processed_doc = self.spacy_processor(text)
        spacy_ms = (time.perf_counter() - start) * 1000

        start = time.perf_counter()
        entities = self.entity_extractor.extract_entities(processed_doc)
        entity_ms = (time.perf_counter() - start) * 1000

        start = time.perf_counter()
        vectorizer = KeyphraseCountVectorizer(
            spacy_pipeline="en_core_web_sm",
            pos_pattern="<J.*>*<N.*>+"
        )

        keywords = self.kw_model.extract_keywords(
            text,
            vectorizer=vectorizer,
            keyphrase_ngram_range=(1, 4),
            stop_words="english",
            use_mmr=True,
            diversity=0.7,
            top_n=self.top_n,
        )
        keybert_ms = (time.perf_counter() - start) * 1000

        start = time.perf_counter()
        for ent, label in entities:
            keywords.append((ent, self.entity_score(label, ent)))


        cleaned = []

        for kw, score in keywords:

            kw = self.text_normalizer.normalize(kw)
            kw_l = kw.lower()

            if kw_l in STOP_PHRASES:
                continue

            if kw_l in STOP_WORDS:
                continue

            if len(kw_l) < 3:
                continue

            cleaned.append((kw, round(score, 4)))

        cleaned = self.entity_deduplicator.deduplicate(items=cleaned)
        cleaned.sort(key=lambda x: x[1], reverse=True)

        extracted_keywords = [
            keyword
            for keyword, score in cleaned[:self.top_n]
        ]

        clean_ms = (time.perf_counter() - start) * 1000
        total_ms = (time.perf_counter() - total_start) * 1000

        self.logger.debug(
            "Keyword extraction completed",
            news_id=str(newsId),
            normalize_ms=round(normalize_ms, 2),
            spacy_ms=round(spacy_ms, 2),
            entity_ms=round(entity_ms, 2),
            keybert_ms=round(keybert_ms, 2),
            clean_ms=round(clean_ms, 2),
            total_ms=round(total_ms, 2),
            keywords=len(extracted_keywords)
        )

        return KeyphraseResponse(results=extracted_keywords)