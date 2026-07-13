package com.example.news.api.entity;

import com.example.news.api.dto.internal.ReactionType;
import jakarta.persistence.*;

@Entity
@Table(
        name = "news_reaction",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"news_id", "user_id"}
        )
)
public class NewsReactionEntity {
    @Id
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id", nullable = false)
    private NewsEntity news;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReactionType type;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public NewsEntity getNews() {
        return news;
    }

    public void setNews(NewsEntity news) {
        this.news = news;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public ReactionType getType() {
        return type;
    }

    public void setType(ReactionType type) {
        this.type = type;
    }
}
