INSERT INTO inference_news(summary, sentiment_label, sentiment, topic_id, news_id)
VALUES (%s, %s, %s, (SELECT id FROM topic WHERE name = %s), %s)
ON CONFLICT (news_id) DO NOTHING
RETURNING id;