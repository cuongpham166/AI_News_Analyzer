package com.example.news.api.dto.response.news;

import com.example.news.api.dto.internal.news.DetailedSourceNews;
import lombok.*;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NewsResponse {
    private UUID id;
    private String title;
    private String link;
    private String lang;
    private Timestamp publishDate;
    private DetailedSourceNews source;
}
