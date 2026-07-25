def transform_document(document):
    return {
        "@timestamp": document["@timestamp"],
        "link": document["link"],
        "publish_date": document["publish_date"],
        "title": document["title"],
        "source": document["source"],
        "sentiment_label": document["sentiment"]["label"],
        "sentiment": document["sentiment"]["score"],
        "topic": document["classification"]["topic"],
        "summary": document["summarization"],
        "content_hash":document["content_hash"],
        "entities": [
            {
                "value": entity["value"],
                "entity_type": entity["type"]
            }
            for entity in document["ner"]["entities"]
        ]
    }