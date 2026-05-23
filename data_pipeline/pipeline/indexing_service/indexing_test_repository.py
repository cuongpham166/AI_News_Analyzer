from data_pipeline.utils.indexing_repository_utils import transform_document
class IndexingTestRepository:
    def __init__(self):
        pass

    def index_news_document(self, document):
        transformed_document = transform_document(document)
        print("index_news_document: ", transformed_document)