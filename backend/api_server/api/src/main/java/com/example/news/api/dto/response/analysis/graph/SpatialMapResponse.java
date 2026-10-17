package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SpatialMapResponse {
    private String location;
    private List<String> aliases;
    private double latitude;
    private double longitude;
    private int frequency;
    private int positiveVolume;
    private int negativeVolume;
    private Double avgSentiment;
    private Double riskScore;
    private String country;
    private String countryCode;
}
