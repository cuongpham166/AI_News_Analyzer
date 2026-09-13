package com.example.news.api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Setter
@Getter
@Entity
@Table(
        name = "rss_sources",
        uniqueConstraints = @UniqueConstraint(columnNames = "url")
)
public class RssSourceEntity {
    @Id
    private Long id;

    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String url;

    @Column(name = "source_name", length = 100)
    private String sourceName;

    @Column(nullable = false)
    private Boolean enabled = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }
}
