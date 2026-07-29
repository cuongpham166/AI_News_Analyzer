package com.example.news.api.dto.response.news;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RecommendedNewsResponse {
    private String id;
    private String language;
    private String link;
    private String publishDate;
    private String summary;
    private String title;
    private double sentiment;
    private double personalizationScore;
    private String reason;
}
