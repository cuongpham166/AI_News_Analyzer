CALL db.index.vector.queryNodes('news_summary_embeddings', $limit, $vector)
YIELD node AS n, score

MATCH (s:Source)-[:PUBLISHED]->(n)
MATCH (n)-[:COVERS]->(t:Topic)

// Grab all the entities your scraping pipeline extracted
OPTIONAL MATCH (n)-[:MENTIONS_PERSON]->(p:Person)
OPTIONAL MATCH (n)-[:MENTIONS_ORGANIZATION]->(o:Organization)
OPTIONAL MATCH (n)-[:MENTIONS_LOCATION]->(l:Location)
OPTIONAL MATCH (n)-[:MENTIONS_EVENT]->(e:Event)

RETURN
  n.title AS title,
  n.summary AS summary,
  s.name AS source,
  t.name AS topic,
  collect(DISTINCT p.name) AS people,
  collect(DISTINCT o.name) AS organizations,
  collect(DISTINCT l.name) AS locations,
  collect(DISTINCT e.name) AS events,
  score
  ORDER BY score DESC