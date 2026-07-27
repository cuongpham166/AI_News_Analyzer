package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TrendingKeywordClusterResponse {
    private String topic;
    private String keyPhrase;
    private int coOccurrence;
    private Double avgSentiment;
}
