INSERT INTO inference_news_keyphrase (inference_news_id,keyphrase_id)
SELECT n.id, k.id
FROM inference_news n, keyphrase k
WHERE n.news_id = %s AND k.value = %s
ON CONFLICT (inference_news_id,keyphrase_id) DO NOTHING;