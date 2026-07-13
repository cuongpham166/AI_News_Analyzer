package com.example.news.api.dto.internal;

public class Neo4jEntity {
    private String news_link;
    private String entity_name;


    public Neo4jEntity() {
    }

    public Neo4jEntity(String news_link, String entity_name) {
        this.news_link = news_link;
        this.entity_name = entity_name;
    }

    public String getNews_link() {
        return this.news_link;
    }

    public void setNews_link(String news_link) {
        this.news_link = news_link;
    }

    public String getEntity_name() {
        return this.entity_name;
    }

    public void setEntity_name(String entity_name) {
        this.entity_name = entity_name;
    }


    @Override
    public String toString() {
        return "{" +
            " news_link='" + getNews_link() + "'" +
            ", entity_name='" + getEntity_name() + "'" +
            "}";
    }

}
