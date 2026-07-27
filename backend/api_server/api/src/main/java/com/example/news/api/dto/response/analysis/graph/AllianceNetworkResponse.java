package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AllianceNetworkResponse {
    private String orgA;
    private String orgB;
    private int sharedArticles;
    private Double avgSentiment;
}
