INSERT INTO news_identity (
    news_id,
    canonical_url
)
VALUES (%s, %s)
ON CONFLICT (canonical_url)
DO NOTHING
RETURNING news_id;