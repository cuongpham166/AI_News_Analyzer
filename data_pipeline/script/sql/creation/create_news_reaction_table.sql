CREATE TABLE IF NOT EXISTS news_reaction (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    news_id UUID REFERENCES news(id),
    user_id TEXT,
    reaction_type TEXT
);