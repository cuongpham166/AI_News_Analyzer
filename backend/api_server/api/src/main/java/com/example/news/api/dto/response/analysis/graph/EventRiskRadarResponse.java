package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EventRiskRadarResponse {
    private String event;
    private int frequency;
    private Double avgSentiment;
    private Double volatility;
}
