CREATE TABLE IF NOT EXISTS inference_news (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    summary TEXT,
    sentiment_label TEXT,
    sentiment NUMERIC(4,2),
    topic_id BIGINT REFERENCES topic(id),
    news_id UUID UNIQUE REFERENCES news(id)
);