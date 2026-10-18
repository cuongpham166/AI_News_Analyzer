CREATE DATABASE IF NOT EXISTS news_analytics;

CREATE TABLE IF NOT EXISTS news_analytics.news_analytics_flat
(
    news_id UUID,
    source_id UInt32,
    source_name LowCardinality(String),

    publish_date DateTime,

    language LowCardinality(String),
    content_hash String,

    sentiment Float32,
    sentiment_label LowCardinality(String),

    topic_id UInt32,
    topic_name LowCardinality(String),

    entities Nested
    (
        id UInt32,
        name String,
        type LowCardinality(String)
    ),

    keyphrases Nested
    (
        id UInt32,
        value String
    )
)
ENGINE = MergeTree
PARTITION BY toYYYYMM(publish_date)
ORDER BY (publish_date, topic_id, source_id);