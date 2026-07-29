package com.example.news.api.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "inference_news_keyphrase",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"inference_news_id", "keyphrase_id"}
        )
)
public class InferenceNewsKeyphraseEntity {
    @Id
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inference_news_id", nullable = false)
    private InferenceNewsEntity inferenceNews;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keyphrase_id", nullable = false)
    private KeyphraseEntity keyphrase;
}
