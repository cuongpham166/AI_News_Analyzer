class IndexingProcessor:
    def __init__(self,indexing_repo):
        self.indexing_repo =indexing_repo

    def check_connection(self):
        print("Check connection: ", self.indexing_repo.check_connection())

    def create_index(self, index_name: str, mapping: dict):
        self.indexing_repo.create_index(index_name,mapping)


    def create_news_index(self):
        self.indexing_repo.create_news_index()


    def index_news_document(self, document):
        self.indexing_repo.index_news_document(document)

    def get_all_news_documents(self):
        return self.indexing_repo.get_all_news_documents()

    def get_news_documents(self, link: str):
        return self.indexing_repo.get_news_documents(link)

    def delete_news_document(self, link: str):
        try:
            self.indexing_repo.delete_news_document(link)
        except Exception as e:
            print("Error deleting document: ", e)
