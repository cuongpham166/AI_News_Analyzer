CREATE TABLE outbox_events (
    event_id UUID PRIMARY KEY,
    news_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ NULL,

    CONSTRAINT fk_outbox_news
        FOREIGN KEY (news_id)
        REFERENCES news_identity(news_id)
);

CREATE INDEX idx_outbox_events_unpublished
ON outbox_events (created_at)
WHERE published_at IS NULL;