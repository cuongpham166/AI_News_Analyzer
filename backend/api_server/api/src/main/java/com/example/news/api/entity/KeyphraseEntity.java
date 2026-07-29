package com.example.news.api.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(
        name = "keyphrase",
        uniqueConstraints = @UniqueConstraint(columnNames = "value")
)
public class KeyphraseEntity {
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String value;

    @OneToMany(mappedBy = "keyphrase")
    private Set<InferenceNewsKeyphraseEntity> inferenceNews = new HashSet<>();
}
