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
    private List<String> aliases;
    private int frequency;
    private int positiveVolume;
    private int negativeVolume;
    private Double avgSentiment;
    private Double volatility;
    private Double riskScore;
    private String countryCode;
    private String country;
    private double latitude;
    private double longitude;

}


