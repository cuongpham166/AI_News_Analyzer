INSERT INTO inference_news_entity (inference_news_id,entity_id)
SELECT n.id, e.id
FROM inference_news n, entity e
WHERE n.news_id = %s AND e.value = %s
ON CONFLICT (inference_news_id,entity_id) DO NOTHING;