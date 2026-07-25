CREATE TABLE IF NOT EXISTS inference_news_entity (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    inference_news_id BIGINT NOT NULL,
    entity_id BIGINT NOT NULL,
    UNIQUE(inference_news_id, entity_id),
    FOREIGN KEY (inference_news_id) REFERENCES inference_news(id),
    FOREIGN KEY (entity_id) REFERENCES entity(id)
);