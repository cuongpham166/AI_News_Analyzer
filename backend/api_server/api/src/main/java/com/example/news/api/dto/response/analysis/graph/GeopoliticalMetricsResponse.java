package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GeopoliticalMetricsResponse {
    private int totalArticles;
    private int hotspots;
    private int countries;
    private Double avgSentiment;
}
