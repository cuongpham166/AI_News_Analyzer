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
        name = "entity",
        uniqueConstraints = @UniqueConstraint(columnNames = "value")
)
public class EntityEntity {
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_type_id")
    private EntityTypeEntity entityType;

    @OneToMany(mappedBy = "entities")
    private Set<InferenceNewsEntityEntity> inferenceNews = new HashSet<>();
}
