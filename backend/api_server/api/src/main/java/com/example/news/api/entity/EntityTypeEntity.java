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
        name = "entity_type",
        uniqueConstraints = @UniqueConstraint(columnNames = "name")
)
public class EntityTypeEntity {
    @Id
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "entityType")
    private Set<EntityEntity> entities = new HashSet<>();
}
