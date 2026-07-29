package com.example.news.api.entity;

import java.sql.Timestamp;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "news")
public class NewsEntity {

    @Id
    private UUID id;

    private String title;

    @Column(name = "publish_date")
    private Timestamp publishDate;

    private String link;

    private String lang;

    @Column(name = "full_text")
    private String fullText;

    @Column(
            name = "content_hash",
            nullable = false,
            unique = true,
            length = 64
    )
    private String contentHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_id")
    private SourceEntity source;

}