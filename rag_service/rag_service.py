import time

import ollama
from elasticsearch import Elasticsearch
from neo4j import GraphDatabase
from sentence_transformers import CrossEncoder

from data_pipeline.config.graph_config import get_neo4j_config
from data_pipeline.config.indexing_config import get_elasticsearch_config
from rag_service.graph_rag.graph_rag import GrapRAG
from rag_service.search_rag.search_rag import SearchRAG


class RAGService:
    def __init__(self,graph_rag,search_rag,reranker):
        self.graph_rag = graph_rag
        self.search_rag = search_rag
        self.reranker = reranker


    def create_fused_context_string(self,user_query: str, time_window: str = "24h", limit: int = 3):
        es_candidates = self.search_rag.search_elasticsearch(user_query, time_window=time_window, limit=limit)
        neo4j_candidates = self.graph_rag.search_neo4j(user_query, limit=limit)

        # 2. Reciprocal Rank Fusion (RRF) & Deduplication Loop
        fused_dossiers = {}

        # Process Elasticsearch Rankings
        for rank, hit in enumerate(es_candidates, start=1):
            doc = hit['_source']
            title = doc.get('title')

            if not title:
                continue

            # RRF Formula: 1 / (60 + rank_position)
            fused_dossiers[title] = {
                "data": doc,
                "rrf_score": 1 / (60 + rank)
            }

        # Process Neo4j Rankings and Fuse Overlaps
        for rank, doc in enumerate(neo4j_candidates, start=1):
            title = doc['title']
            if title in fused_dossiers:
                # High-Signal Match! Both engines found it, so combine their weights
                fused_dossiers[title]["rrf_score"] += 1 / (60 + rank)

                existing_data = fused_dossiers[title]["data"]

                # Merge structural graph data into the Elastic profile if missing
                fused_dossiers[title]["data"]["people"] = list(set(existing_data.get("people", []) + doc.get("people", [])))
                fused_dossiers[title]["data"]["organizations"] = list(set(existing_data.get("organizations", []) + doc.get("organizations", [])))
                fused_dossiers[title]["data"]["locations"] = list(set(existing_data.get("locations", []) + doc.get("locations", [])))
                fused_dossiers[title]["data"]["events"] = list(set(existing_data.get("events", []) + doc.get("events", [])))

                # If the existing profile only has a summary, upgrade it to full_text from the other engine
                if not fused_dossiers[title]["data"].get("full_text") and doc.get("full_text"):
                    fused_dossiers[title]["data"]["full_text"] = doc["full_text"]
            else:
                fused_dossiers[title] = {
                    "data": {
                        "title": title,
                        "summary": doc.get("summary", ""),
                        "full_text": doc.get("full_text", ""),
                        "source": doc.get("source", "Unknown"),
                        "topic": doc.get("topic", "General"),
                        "people": doc.get("people", []),
                        "organizations": doc.get("organizations", []),
                        "locations": doc.get("locations", []),
                        "events": doc.get("events", [])
                    },
                    "rrf_score": 1 / (60 + rank)
                }

        # 3. Prepare Text Blocks for the Cross-Encoder Reranker
        fused_items = list(fused_dossiers.values())
        if not fused_items:
            return "No relevant intelligence found across database clusters within the requested time frame."

        rerank_pairs = []
        for item in fused_items:
            doc = item["data"]
            # Build a comprehensive dossier string for the cross-encoder to evaluate
            dossier_text = (
                f"Title: {doc['title']} | Topic: {doc['topic']} | Source: {doc['source']} | "
                f"Summary: {doc['summary']} | Full Text: {doc.get('full_text', '')} | "
                f"Entities: {', '.join(doc['people'] + doc['organizations'] + doc['locations'] + doc['events'])}"
            )
            rerank_pairs.append([user_query, dossier_text])

        # 4. Run Reranker Filter
        print(f"⚖️ Reranking {len(rerank_pairs)} integrated candidates...")
        rerank_scores = self.reranker.predict(rerank_pairs)

        # Attach rerank scores back to data items
        for idx, score in enumerate(rerank_scores):
            fused_items[idx]["rerank_score"] = float(score)

        # Sort completely by rerank score (highest to lowest)
        fused_items.sort(key=lambda x: x["rerank_score"], reverse=True)

        # Truncate pool precisely to your user-requested limit
        final_top_dossiers = fused_items[:limit]

        # 5. Build Grounded LLM Context Window Prompt
        fused_context_blocks = []
        for idx, item in enumerate(final_top_dossiers, start=1):
            doc = item["data"]
            block = (
                f"--- INTEL DOSSIER {idx} ---\n"
                f"TITLE: {doc['title']}\n"
                f"SOURCE: {doc['source']} | TOPIC: {doc['topic']}\n"
                f"SUMMARY: {doc['summary']}\n"
                f"DETAILED TEXT: {doc.get('full_text', 'N/A')}\n"
                f"CONNECTED GRAPH ENTITIES:\n"
                f"  - People: {', '.join(doc['people']) if doc['people'] else 'None'}\n"
                f"  - Organizations: {', '.join(doc['organizations']) if doc['organizations'] else 'None'}\n"
                f"  - Locations: {', '.join(doc['locations']) if doc['locations'] else 'None'}\n"
                f"  - Events: {', '.join(doc['events']) if doc['events'] else 'None'}\n"
            )
            fused_context_blocks.append(block)

        fused_context_string = "\n".join(fused_context_blocks)
        return fused_context_string

    def run_rag_service(self,user_query: str, time_window: str = "24h", limit: int = 3):
        fused_context_string = self.create_fused_context_string(user_query,time_window,limit)
        system_instruction = (
            "You are an advanced Geopolitical Intelligence Analysis Model. Your goal is to provide "
            "objective, fact-grounded reporting based strictly on the provided Intel Dossiers. "
            "If the dossiers do not contain information to answer a question, state that you lack "
            "direct evidence. Never hypothesize or extrapolate past the context block."
        )

        user_prompt = f"CONTEXT DOSSIERS:\n{fused_context_string}\n\nUSER ANALYSIS REQUEST: {user_query}"

        # 6. Run Inference locally via Ollama
        print(f"🤖 Generating final analysis using Llama 3.2 3B...")
        response = ollama.generate(
            model="llama3.2:3b", # or your exact local model tag
            prompt=user_prompt,
            system=system_instruction,
            options={"temperature": 0.15} # Keep it highly deterministic to limit hallucinations
        )

        return response['response']

    def compare_rag_models(self, user_query: str, time_window: str = "24h", limit: int = 3):
        print(f"Gathering context dossiers for comparison...")
        fused_context_string = self.create_fused_context_string(user_query,time_window,limit)
        system_instruction = (
            "You are an advanced Geopolitical Intelligence Analysis Model. Your goal is to provide "
            "objective, fact-grounded reporting based strictly on the provided Intel Dossiers. "
            "If the dossiers do not contain information to answer a question, state that you lack "
            "direct evidence. Never hypothesize or extrapolate past the context block."
        )
        user_prompt = f"CONTEXT DOSSIERS:\n{fused_context_string}\n\nUSER ANALYSIS REQUEST: {user_query}"


        print("\nRunning Model 1: Llama 3.2 3B...")
        start_time = time.time()
        llama_response = ollama.generate(
            model="llama3.2:3b",
            prompt=user_prompt,
            system=system_instruction,
            options={"temperature": 0.15}
        )
        llama_time = time.time() - start_time


        print("Running Model 2: Phi-3.5 Mini...")
        start_time = time.time()
        phi_response = ollama.generate(
            model="phi3.5",
            prompt=user_prompt,
            system=system_instruction,
            options={"temperature": 0.15}
        )
        phi_time = time.time() - start_time


        print("Running Model 3: Qwen2.5 3B...")
        start_time = time.time()
        qwen_response = ollama.generate(
            model="qwen2.5:3b",
            prompt=user_prompt,
            system=system_instruction,
            options={"temperature": 0.15}
        )
        qwen_time = time.time() - start_time

        print("Running Model 4: Ministral3:3b...")
        start_time = time.time()
        ministral3_response = ollama.generate(
            model="ministral-3:3b-instruct-2512-q4_K_M",
            prompt=user_prompt,
            system=system_instruction,
            options={"temperature": 0.15}
        )
        ministral3_time = time.time() - start_time

        print("Running Model 5: SmolLM3:3b...")
        start_time = time.time()
        smolLM3_response = ollama.generate(
            model="alibayram/smollm3",
            prompt=user_prompt,
            system=system_instruction,
            options={"temperature": 0.15}
        )
        smolLM3_time = time.time() - start_time

        print("Running Model 6: Granite4:3b...")
        start_time = time.time()
        granite4_response = ollama.generate(
            model="granite4:3b",
            prompt=user_prompt,
            system=system_instruction,
            options={"temperature": 0.15}
        )
        granite4_time = time.time() - start_time


        print("\n" + "="*40 + " RAG MODEL COMPARISON " + "="*40)
        print(f"Query: {user_query}\n")

        print(f"--- [ MODEL 1: LLAMA 3.2 3B ] (Gen Time: {llama_time:.2f}s) ---")
        print(llama_response['response'])
        print("\n" + "-"*102 + "\n")

        print(f"--- [ MODEL 2: PHI-3.5 MINI 3.8B ] (Gen Time: {phi_time:.2f}s) ---")
        print(phi_response['response'])
        print("\n" + "-"*102 + "\n")

        print(f"--- [ MODEL 3: Qwen2.5 3B ] (Gen Time: {qwen_time:.2f}s) ---")
        print(qwen_response['response'])
        print("\n" + "-"*102 + "\n")

        print(f"--- [ MODEL 4: Ministral3:3b ] (Gen Time: {ministral3_time:.2f}s) ---")
        print(ministral3_response['response'])
        print("\n" + "-"*102 + "\n")

        print(f"--- [ MODEL 5: SmolLM3:3b ] (Gen Time: {smolLM3_time:.2f}s) ---")
        print(smolLM3_response['response'])
        print("\n" + "-"*102 + "\n")

        print(f"--- [ MODEL 6: Granite4:3b ] (Gen Time: {granite4_time:.2f}s) ---")
        print(granite4_response['response'])
        print("="*102)

if __name__ == "__main__":
    graph_config = get_neo4j_config()
    driver = GraphDatabase.driver(
        graph_config["uri"],
        auth=(graph_config["username"], graph_config["password"])
    )

    reranker = CrossEncoder("BAAI/bge-reranker-large")

    elastic_config = get_elasticsearch_config()
    es_client = Elasticsearch(elastic_config["elastic_url"])

    graph_rag = GrapRAG(driver,reranker)
    search_rag = SearchRAG(es_client)

    test_query = "Analyze the security implications regarding the UNRWA compound incident in East Jerusalem over the last 24 hours. Who are the key organizations and people tied to this development?"

    rag_service = RAGService(graph_rag,search_rag,reranker)
    rag_service.compare_rag_models(user_query=test_query)