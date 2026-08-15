UPDATE outbox_events
SET published_at = NOW()
WHERE event_id = %s
  AND published_at IS NULL;