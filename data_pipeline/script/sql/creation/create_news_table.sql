CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY,
    title TEXT,
    publish_date TIMESTAMP,
    link TEXT UNIQUE NOT NULL,
    lang TEXT,
    full_text TEXT,
    content_hash CHAR(64) NOT NULL UNIQUE
    source_id integer REFERENCES source(id)
);