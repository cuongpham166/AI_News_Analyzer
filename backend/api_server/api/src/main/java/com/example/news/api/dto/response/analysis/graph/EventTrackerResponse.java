package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

import java.util.List;

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

    private String countryCode;
    private String country;
    private double latitude;
    private double longitude;
    private List<String> aliases;
}


