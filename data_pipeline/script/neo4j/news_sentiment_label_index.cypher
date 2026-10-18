CREATE INDEX news_sentiment_label_idx IF NOT EXISTS
FOR (n:News) ON (n.sentiment_label);