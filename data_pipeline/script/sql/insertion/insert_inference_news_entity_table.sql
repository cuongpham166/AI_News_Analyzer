INSERT INTO inference_news_entity (inference_news_id,entity_id)
SELECT i.id, e.id
FROM inference_news i, entity e
WHERE n.id = %s AND e.value = %s
ON CONFLICT (inference_news_id,entity_id) DO NOTHING;