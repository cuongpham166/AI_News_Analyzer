package com.example.news.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "inference_news_entity",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"inference_news_id", "entity_id"}
        )
)
public class InferenceNewsEntityEntity {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inference_news_id", nullable = false)
    private InferenceNewsEntity inferenceNews;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private EntityEntity entities;

}
