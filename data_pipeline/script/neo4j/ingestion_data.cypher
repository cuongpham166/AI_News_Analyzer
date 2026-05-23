MERGE (s:Source {name: $source_name})
MERGE (t:Topic {name: $topic_name})
MERGE (n:News {link: $news_link})
  ON CREATE SET
  n.title = $news_title,
  n.publish_date = datetime($news_publish_date),
  n.sentiment = $news_sentiment,
  n.language = $news_language,
  n.summary = $news_summary,
  n.summary_embedding = $news_embedding
  ON MATCH SET
  n.title = $news_title,
  n.publish_date = datetime($news_publish_date),
  n.sentiment = $news_sentiment,
  n.language = $news_language,
  n.summary = $news_summary,
  n.summary_embedding = $news_embedding

MERGE (s)-[:PUBLISHED]->(n)
MERGE (n)-[:COVERS]->(t)

WITH n, $entities AS entities

FOREACH (p IN entities.persons |
  MERGE (person:Person {id: p.id})
  SET person.name = p.name
  MERGE (n)-[:MENTIONS_PERSON]->(person)
)

FOREACH (o IN entities.organizations |
  MERGE (org:Organization {id: o.id})
  SET org.name = o.name
  MERGE (n)-[:MENTIONS_ORGANIZATION]->(org)
)

FOREACH (l IN entities.locations |
  MERGE (loc:Location {id: l.id})
  SET loc.name = l.name
  MERGE (n)-[:MENTIONS_LOCATION]->(loc)
)

FOREACH (e IN entities.events |
  MERGE (event:Event {id: e.id})
  SET event.name = e.name
  MERGE (n)-[:MENTIONS_EVENT]->(event)
)