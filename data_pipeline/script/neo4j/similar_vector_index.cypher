CREATE VECTOR INDEX news_summary_embeddings IF NOT EXISTS
FOR (n:News)
ON (n.summary_embedding)
OPTIONS {
    indexConfig: {
        `vector.dimensions`: 768,
        `vector.similarity_function`: 'cosine'
    }
};