CREATE FULLTEXT INDEX news_keywords_index IF NOT EXISTS
FOR (n:News) ON EACH [n.title, n.summary]