package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InfluencerNetworkResponse {
    private String personA;
    private String personB;
    private int sharedArticles;
    private Double avgSentiment;
    private Double volatility;
}
