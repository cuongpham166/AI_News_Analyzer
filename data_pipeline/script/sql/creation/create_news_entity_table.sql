CREATE TABLE news_identity (
    news_id UUID PRIMARY KEY,
    canonical_url TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);