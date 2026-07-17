INSERT INTO news (id, title, publish_date, link, lang, full_text, content_hash, source_id)
VALUES (
  %s, %s, to_timestamp(%s), %s, %s, %s, %s,
  (SELECT id FROM source WHERE name = %s)
)
ON CONFLICT (content_hash) DO NOTHING
RETURNING id;