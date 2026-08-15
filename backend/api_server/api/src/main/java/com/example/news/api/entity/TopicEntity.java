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
        name = "topic",
        uniqueConstraints = @UniqueConstraint(columnNames = "name")
)
public class TopicEntity {
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "topic"
    )
    private Set<InferenceNewsEntity> inferenceNewsEntities = new HashSet<>();

}
