package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EventTrackerMetricsResponse {
    private int eventsTracked;
    private int totalEventCoverage;
    private Double avgSentiment;
}
