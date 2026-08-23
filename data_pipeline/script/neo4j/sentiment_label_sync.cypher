UNWIND $news AS item
MATCH (n:News {id: item.news_id})
SET n.sentiment_label = item.sentiment_label