CREATE TABLE IF NOT EXISTS inference_news_entity (
    id SERIAL PRIMARY KEY,
    inference_news_id integer NOT NULL,
    entity_id integer NOT NULL,
    UNIQUE(news_id, entity_id),
    FOREIGN KEY (inference_news_id) REFERENCES inference_news(id),
    FOREIGN KEY (entity_id) REFERENCES entity(id)
);