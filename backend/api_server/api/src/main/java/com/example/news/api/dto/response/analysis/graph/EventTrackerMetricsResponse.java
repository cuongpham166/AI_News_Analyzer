package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EventTrackerMetricsResponse {
    private int eventsTracked;
    private int totalMentions;
    private int positiveVolume;
    private int negativeVolume;
    private Double avgSentiment;
    private Double avgVolatility;
    private int highRiskEvents;
}
