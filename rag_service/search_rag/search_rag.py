from rag_service.utils.search_rag_utils import parse_time_window_to_epoch


class SearchRAG:
    def __init__(self, es_client):
        self.es_client = es_client

    def search_elasticsearch(self, user_query: str, time_window: str = "24h", limit: int = 3):
        start_epoch = parse_time_window_to_epoch(time_window)
        search_query = {
            "size": limit * 2,
            "query": {
                "bool": {
                    "must": [
                        {
                            "multi_match": {
                                "query": user_query,
                                "fields": [
                                    "title^3",
                                    "entities.value^4",
                                    "summary^2",
                                    "full_text"
                                ],
                                "type": "best_fields"
                            }
                        }
                    ],
                    "filter": [
                        {
                            "range": {
                                "publish_date": {
                                    "gte": start_epoch
                                }
                            }
                        }
                    ]
                }
            }
        }

        response = self.es_client.search(index="news", body=search_query)
        return response['hits']['hits']