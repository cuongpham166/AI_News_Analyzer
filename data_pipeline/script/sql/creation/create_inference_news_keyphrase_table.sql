CREATE TABLE IF NOT EXISTS inference_news_keyphrase (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inference_news_id BIGINT NOT NULL,
    keyphrase_id BIGINT NOT NULL,
    UNIQUE(inference_news_id, keyphrase_id),
    FOREIGN KEY (inference_news_id) REFERENCES inference_news(id),
    FOREIGN KEY (keyphrase_id) REFERENCES keyphrase(id)
);