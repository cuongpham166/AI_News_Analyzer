CREATE TABLE IF NOT EXISTS inference_news (
    id SERIAL PRIMARY KEY,
    summary TEXT,
    sentiment_label TEXT,
    sentiment NUMERIC(4,2),
    topic_id integer REFERENCES topic(id),
    news_id UUID REFERENCES news(id)
);