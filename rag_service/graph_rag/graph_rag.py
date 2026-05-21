from pathlib import Path

import ollama
from neo4j import GraphDatabase,Query
from data_pipeline.config.graph_config import get_neo4j_config

class GrapRAG:
    def __init__(self):
        self.driver = None

    def connect(self):
        graph_config = get_neo4j_config()
        uri = graph_config.uri
        username = graph_config.username
        password = graph_config.password
        self.driver = GraphDatabase(uri,auth=(username,password))

    def close(self):
        if self.driver:
            self.driver.close()

    def get_local_embedding(self, text: str):
        response = ollama.embeddings(model="nomic-embed-text", prompt=text)
        return response["embedding"]

    def retrieval_query(self)-> Query:
        cypher_file = Path("data_pipeline/script/neo4j/vector_search.cypher")
        cypher_text = cypher_file.read_text()
        return Query(cypher_text)

    def run_graph_rag(self, user_query: str, limit: int = 3):
        query_vector = self.get_local_embedding(user_query)
        cypher_query = self.retrieval_query()
        graph_data=[]

        with self.driver.session() as session:
            result = session.run(cypher_query, vector=query_vector, limit=limit)
            for record in result:
                graph_data.append(record.data())

        if len(graph_data) == 0:
            return "No relevant news or connections found in the offline database."

        context_blocks = []
        for i, item in enumerate(graph_data, 1):
            title = item['n']['title']
            summary = item['n']['summary']
            source = item['s']['name']
            topic = item['t']['name']
            score = item['score']

            block = f"--- INTEL DOSSIER {i} (Match Relevance: {score:.2f}) ---\n"
            block += f"ARTICLE: {title}\n"
            block += f"SOURCE: {source} | MAIN TOPIC: {topic}\n"
            block += f"SUMMARY: {summary}\n"

            if item['people']:
                people_names = [p['name'] for p in item['people']]
                block += f"CONNECTED PEOPLE: {', '.join(people_names)}\n"

            if item['organizations']:
                org_names = [o['name'] for o in item['organizations']]
                block += f"CONNECTED ORGANIZATIONS: {', '.join(org_names)}\n"

            if item['locations']:
                loc_names = [l['name'] for l in item['locations']]
                block += f"CONNECTED LOCATIONS: {', '.join(loc_names)}\n"

            if item['events']:
                event_names = [e['name'] for e in item['events']]
                block += f"CONNECTED EVENTS: {', '.join(event_names)}\n"

            context_blocks.append(block)

        fused_context = "\n".join(context_blocks)

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