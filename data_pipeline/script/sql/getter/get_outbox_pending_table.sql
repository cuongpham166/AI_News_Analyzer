SELECT
    event_id,
    news_id,
    event_type,
    payload
FROM outbox_events
WHERE published_at IS NULL
ORDER BY created_at
LIMIT %s;