class ArticleTestRepository:
    def __init__(self):
        self.articles = []

    def insert_news_data(self, news):
        #title, publish_date, link, lang, full_text
        new_article = {
            "title":news["title"],
            "publish_date":news["publish_date"],
            "link":news["link"],
            "lang":news["language"],
            "full_text":news["text"],
            "summary": "",
            "sentiment_label":"",
            "sentiment":""
        }
        self.articles.append(new_article)
        return len(self.articles)

    def update_news_data(self, updated_data):
        for article in self.articles:
            if article["link"] == updated_data["link"]:
                article.update(
                    {
                        "summary":updated_data["summarization"],
                        "sentiment_label":updated_data["sentiment"]["label"],
                        "sentiment":updated_data["sentiment"]["score"]
                    }
                )
