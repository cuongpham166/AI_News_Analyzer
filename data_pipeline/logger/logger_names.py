class LoggerName:
    ROOT = "pipeline"

    class Ingestion:
        SERVICE = "pipeline.ingestion"
        PRODUCER = "pipeline.ingestion_producer"
        PROCESSOR = "pipeline.ingestion_processor"

        def __new__(cls, *args, **kwargs):
            raise TypeError("Constants only")

    class Normalization:
        SERVICE = "pipeline.normalization"
        CONSUMER = "pipeline.normalization.consumer"
        PROCESSOR = "pipeline.normalization.processor"

        def __new__(cls, *args, **kwargs):
            raise TypeError("Constants only")

    class Inference:
        SERVICE = "pipeline.inference"
        CONSUMER = "pipeline.inference.consumer"
        PROCESSOR = "pipeline.inference.processor"
        SENTIMENT = "pipeline.inference.sentiment"
        TOPIC = "pipeline.inference.topic"
        ENTITY = "pipeline.inference.entity"
        SUMMARY = "pipeline.inference.summary"
        KEYWORD = "pipeline.inference.keyword"

        def __new__(cls, *args, **kwargs):
            raise TypeError("Constants only")

    class Article:
        SERVICE = "pipeline.article"
        CONSUMER = "pipeline.article.consumer"
        PROCESSOR = "pipeline.article.processor"
        REPOSITORY = "pipeline.article.repository"

        def __new__(cls, *args, **kwargs):
            raise TypeError("Constants only")

    class Indexing:
        SERVICE = "pipeline.indexing"
        CONSUMER = "pipeline.indexing.consumer"
        PROCESSOR = "pipeline.indexing.processor"
        REPOSITORY = "pipeline.indexing.repository"

        def __new__(cls, *args, **kwargs):
            raise TypeError("Constants only")

    class Graph:
        SERVICE = "pipeline.graph"
        CONSUMER = "pipeline.graph.consumer"
        PROCESSOR = "pipeline.graph.processor"
        REPOSITORY = "pipeline.graph.repository"

        def __new__(cls, *args, **kwargs):
            raise TypeError("Constants only")