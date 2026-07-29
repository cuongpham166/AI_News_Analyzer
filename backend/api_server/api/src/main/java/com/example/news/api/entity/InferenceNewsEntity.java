package com.example.news.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "inference_news")
public class InferenceNewsEntity {

    @Id
    private Long id;

    private String summary;

    @Column(name = "sentiment_label")
    private String sentimentLabel;

    private BigDecimal sentiment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private TopicEntity topic;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "news_id", referencedColumnName = "id")
    private NewsEntity news;

    @OneToMany(mappedBy = "inferenceNews",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Set<InferenceNewsKeyphraseEntity> keyphrases = new HashSet<>();

    @OneToMany(mappedBy = "inferenceNews",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private Set<InferenceNewsEntityEntity> entities = new HashSet<>();

}
