import psycopg

class ArticleProcessor:
    def __init__(self, article_repo):
        self.article_repo = article_repo

    def check_connection(self):
        self.article_repo.check_connection()


    def run_init_configs(self):
        self.article_repo.run_init_configs()


    def create_entity_type_table(self):
        try:
            self.article_repo.create_entity_type_table()
        except psycopg.Error as e:
            print("Error", e)

    def create_entity_table(self):
        try:
            self.article_repo.create_entity_table()
        except psycopg.Error as e:
            print("Error", e)

    def create_source_table(self):
        try:
            self.article_repo.create_source_table()
        except psycopg.Error as e:
            print("Error", e)

    def create_topic_table(self):
        try:
            self.article_repo.create_topic_table()
        except psycopg.Error as e:
            print("Error", e)

    def create_news_table(self):
        try:
            self.article_repo.create_news_table()
        except psycopg.Error as e:
            print("Error", e)

    def create_news_entity_table(self):
        try:
            self.article_repo.create_news_entity_table()
        except psycopg.Error as e:
            print("Error", e)

    def insert_entity_type_data(self, entity_types):
        try:
            self.article_repo.insert_entity_type_data(entity_types)
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()

    def insert_entity_data(self, entities):
        try:
            self.article_repo.insert_entity_data(entities)
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()

    def insert_source_data(self, sources):
        try:
            self.article_repo.insert_entity_data(sources)
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()

    def insert_topic_data(self, topics):
        try:
            self.article_repo.insert_topic_data(topics)
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()

    def insert_news(self, news):
        try:
            new_id = self.article_repo.insert_news(news)
            return new_id
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()

    def insert_inference_news(self,inference_news):
        try:
            return self.article_repo.insert_inference_news(inference_news)
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()
            return false

    def insert_news_entity_data(self, news_link, news_entity):
        try:
            self.article_repo.insert_news_entity_data(news_link,news_entity)
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()

    # insert entity_type => insert entity => update_news with AI results => insert_news_entity
    def update_news_data(self, updated_data):
        try:
            self.article_repo.update_news_data(updated_data)
        except psycopg.Error as e:
            print("Error", e)
            self.article_repo.rollback()

    def fetch_all_data(self, table_name):
        self.article_repo.fetch_all_data(table_name)

    def fetch_missing_data(self):
        self.article_repo.fetch_missing_data()