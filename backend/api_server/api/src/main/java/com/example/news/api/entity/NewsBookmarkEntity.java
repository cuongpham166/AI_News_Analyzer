package com.example.news.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(
        name = "news_bookmark",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"news_id", "user_id"})
        }
)
public class NewsBookmarkEntity {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id", nullable = false)
    private NewsEntity news;

    @Column(name = "user_id", nullable = false)
    private String userId;

}
