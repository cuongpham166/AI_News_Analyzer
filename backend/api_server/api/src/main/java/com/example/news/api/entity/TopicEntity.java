package com.example.news.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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


}
