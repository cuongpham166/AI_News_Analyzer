INSERT INTO keyphrase (value)
VALUES (%s)
ON CONFLICT (value) DO NOTHING;