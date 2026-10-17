package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CountryRiskResponse {
    private String country;
    private String countryCode;
    private int frequency;
    private int positiveVolume;
    private int negativeVolume;
    private Double avgSentiment;
    private Double riskScore;
    private Double coveragePercent;
}
