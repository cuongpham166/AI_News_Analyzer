package com.example.news.api.dto.response.news;

import lombok.*;
import java.sql.Timestamp;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DetailedNewsResponse {
    private UUID id;
    private String title;
    private Timestamp publishDate;
    private String link;
    private String language;
    private String fullText;
    private Integer sourceId;
    private String source_name;
}
