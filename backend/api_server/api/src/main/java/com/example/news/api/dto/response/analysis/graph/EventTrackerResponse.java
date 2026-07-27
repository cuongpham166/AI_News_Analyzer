package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EventTrackerResponse {
    private String event;
    private String location;
    private int strength;
    private Double avgSentiment;
    private Double volatility;
}


