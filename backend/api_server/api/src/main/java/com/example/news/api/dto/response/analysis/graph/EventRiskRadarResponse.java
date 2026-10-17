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
    private int positiveVolume;
    private int negativeVolume;
    private Double avgSentiment;
    private Double volatility;
    private Double riskScore;
    private Double polarizationScore;
}
