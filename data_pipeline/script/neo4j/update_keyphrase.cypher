MATCH (n:News {link: $news_link})

WITH n, $keyphrases AS keyphrases
UNWIND keyphrases AS phrase

MERGE (kp:Keyphrase {name: phrase})
MERGE (n)-[:TAGGED_WITH]->(kp)