from pathlib import Path

import ollama
from neo4j import GraphDatabase,Query
from data_pipeline.config.graph_config import get_neo4j_config
from sentence_transformers import CrossEncoder

class GrapRAG:
    def __init__(self, driver,reranker):
        self.driver = driver
        self.reranker = reranker

    def close(self):
        if self.driver:
            self.driver.close()

    def get_local_embedding(self, text: str):
        response = ollama.embeddings(model="nomic-embed-text", prompt=text)
        return response["embedding"]

    def create_vector_index_if_missing(self):
        """Ensures the 768-dimension Nomic vector index exists in Neo4j."""
        index_query = """
        CREATE VECTOR INDEX news_summary_embeddings IF NOT EXISTS
        FOR (n:News) ON (n.summary_embedding)
        OPTIONS {
          indexConfig: {
            `vector.dimensions`: 768,
            `vector.similarity_function`: 'cosine'
          }
        }
        """
        with self.driver.session() as session:
            session.run(index_query)
            print("✅ Vector index validation complete.")

    def retrieval_query(self)-> Query:
        cypher_file = Path("data_pipeline/script/neo4j/vector_search.cypher")
        cypher_text = cypher_file.read_text()
        return Query(cypher_text)

    def create_fulltext_index(self):
        index_query = """
            CREATE FULLTEXT INDEX news_keywords_index IF NOT EXISTS
            FOR (n:News) ON EACH [n.title, n.summary]
        """
        with self.driver.session() as session:
            session.run(index_query)
            print("Fulltext index validation complete.")

    def run_graph_rag(self, user_query: str, limit: int = 3):
        # 1. Generate local vector
        query_vector = self.get_local_embedding(user_query)
        cypher_query = self.retrieval_query()

        # 2. Run the hybrid query against Neo4j
        graph_data = []
        with self.driver.session() as session:
            # Note: We pass user_query as a separate parameter now for BM25 matching
            result = session.run(cypher_query, vector=query_vector, user_query=user_query, limit=limit)
            for record in result:
                graph_data.append(record.data())

        if not graph_data:
            return "No relevant intelligence found."

        # 3. Create the list of text strings that the reranker will evaluate
        candidate_blocks = []
        for item in graph_data:
            # Build a comprehensive string representing the full data point
            text_to_evaluate = (
                f"Title: {item['title']} | Summary: {item['summary']} | "
                f"Entities: {', '.join(item['people'] + item['organizations'] + item['locations'])}"
            )
            candidate_blocks.append((item, text_to_evaluate))

        # 4. Use the CrossEncoder to compute strict alignment scores
        # We pass pairs of (User Query, Candidate Text)
        pairs = [[user_query, block[1]] for block in candidate_blocks]
        rerank_scores = self.reranker.predict(pairs)

        # Attach scores and sort candidates from highest to lowest exact relevance
        for idx, score in enumerate(rerank_scores):
            candidate_blocks[idx][0]['rerank_score'] = float(score)

        candidate_blocks.sort(key=lambda x: x[0]['rerank_score'], reverse=True)

        # 5. Take only the top entries defined by your 'limit' to format your final Intel Dossiers
        final_context_blocks = []
        for i, (item, _) in enumerate(candidate_blocks[:limit], 1):
            block = f"--- INTEL DOSSIER {i} (Rerank Relevance: {item['rerank_score']:.4f}) ---\n"
            block += f"ARTICLE: {item['title']}\n"
            block += f"SUMMARY: {item['summary']}\n"
            if item.get('people'): block += f"CONNECTED PEOPLE: {', '.join(item['people'])}\n"
            if item.get('organizations'): block += f"CONNECTED ORGANIZATIONS: {', '.join(item['organizations'])}\n"
            if item.get('locations'): block += f"CONNECTED LOCATIONS: {', '.join(item['locations'])}\n"
            final_context_blocks.append(block)

        fused_context = "\n".join(final_context_blocks)

        system_prompt = (
            "You are an offline intelligence analyst. Review the provided Intel Dossiers extracted "
            "from our knowledge graph. Answer the user's question focusing heavily on connections, "
            "overlapping entities, or key events. Do not invent facts outside of the provided text."
        )
        user_prompt = f"Graph Database Context:\n{fused_context}\n\nUser Analysis Request: {user_query}"

        response = ollama.chat(
            model='llama3.2:3b',
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': user_prompt}
            ],
            options={
                'temperature': 0.15,
                'num_ctx': 8192
            }
        )
        return response['message']['content']

    def search_neo4j(self, user_query: str, limit: int = 3):
        # 1. Generate local vector embedding
        query_vector = self.get_local_embedding(user_query)
        cypher_query = self.retrieval_query()

        graph_results = []

        # 2. Query the Graph Database
        with self.driver.session() as session:
            # Note: We over-sample slightly (limit * 2) so the global Reranker has
            # a healthy candidate pool to evaluate alongside the Elasticsearch pool
            result = session.run(
                cypher_query,
                vector=query_vector,
                user_query=user_query,
                limit=limit * 2
            )

            for record in result:
                item = record.data()

                # 3. Standardize and normalize dictionary keys
                graph_results.append({
                    "title": item.get("title"),
                    "summary": item.get("summary"),
                    "source": item.get("source", "Unknown"),
                    "topic": item.get("topic", "General"),
                    # Fallback to empty lists if your graph paths didn't find specific entities
                    "people": item.get("people", []),
                    "organizations": item.get("organizations", []),
                    "locations": item.get("locations", []),
                    # If your Cypher query doesn't match events node yet, supply empty list
                    "events": item.get("events", [])
                })

        return graph_results