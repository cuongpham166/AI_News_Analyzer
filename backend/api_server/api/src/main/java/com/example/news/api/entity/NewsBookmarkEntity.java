package com.example.news.api.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "news_bookmark",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"news_id", "user_id"})
        }
)
public class NewsBookmarkEntity {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id", nullable = false)
    private NewsEntity news;

    @Column(name = "user_id", nullable = false)
    private String userId;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public NewsEntity getNews() {
        return news;
    }

    public void setNews(NewsEntity news) {
        this.news = news;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
