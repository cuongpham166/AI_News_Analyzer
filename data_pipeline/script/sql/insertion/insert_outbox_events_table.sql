INSERT INTO outbox_events (
    event_id,
    news_id,
    event_type,
    payload
)
VALUES (%s, %s, %s, %s);