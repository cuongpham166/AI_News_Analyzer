SELECT n.*
FROM news n
WHERE NOT EXISTS (
    SELECT 1
    FROM inference_news i
    WHERE i.news_id = n.id
);