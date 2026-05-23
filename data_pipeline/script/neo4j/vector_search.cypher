// 1. Perform Exact Keyword Search (BM25)
CALL db.index.fulltext.queryNodes('news_keywords_index', $user_query)
YIELD node AS textNode, score AS bm25Score
WITH collect({node: textNode, score: bm25Score}) AS bm25Results

// 2. Perform Semantic Vector Search
CALL db.index.vector.queryNodes('news_summary_embeddings', $limit * 2, $vector)
YIELD node AS vecNode, score AS vecScore
WITH bm25Results, collect({node: vecNode, score: vecScore}) AS vecResults

// 3. FIXED: Combine and deduplicate lists using native Cypher + and UNWIND
WITH bm25Results + vecResults AS combinedResults
UNWIND combinedResults AS item
WITH item.node AS n, max(item.score) AS rawScore

MATCH (s:Source)-[:PUBLISHED]->(n)
MATCH (n)-[:COVERS]->(t:Topic)

// 4. Entity Graph Search (Multi-hop connections)
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
  rawScore
  ORDER BY rawScore DESC
  LIMIT $limit * 3  // Over-sample for the reranker