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

UNWIND entities.persons AS p
MERGE (person:Person {id: p.id})
SET person.name = p.name
MERGE (n)-[:MENTIONS_PERSON]->(person)

UNWIND entities.organizations AS o
MERGE (org:Organization {id: o.id})
SET org.name = o.name
MERGE (n)-[:MENTIONS_ORGANIZATION]->(org)

UNWIND entities.locations AS l
MERGE (loc:Location {id: l.id})
SET loc.name = l.name
MERGE (n)-[:MENTIONS_LOCATION]->(loc)

UNWIND entities.events AS e
MERGE (event:Event {id: e.id})
SET event.name = e.name
MERGE (n)-[:MENTIONS_EVENT]->(event)