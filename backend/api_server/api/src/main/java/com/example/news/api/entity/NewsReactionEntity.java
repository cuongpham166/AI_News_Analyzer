package com.example.news.api.entity;

import com.example.news.api.dto.internal.ReactionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(
        name = "news_reaction",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"news_id", "user_id"}
        )
)
public class NewsReactionEntity {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "news_id", nullable = false)
    private NewsEntity news;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reaction_type",nullable = false)
    private ReactionType type;

}
