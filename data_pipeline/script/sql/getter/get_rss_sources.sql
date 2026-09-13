SELECT id, url, source_name
FROM rss_sources
WHERE enabled = TRUE
ORDER BY id;