CREATE TABLE IF NOT EXISTS news_reaction (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    news_id UUID REFERENCES news(id),
    user_id TEXT NOT NULL,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_news_reaction_news_user
        UNIQUE (news_id, user_id)
);