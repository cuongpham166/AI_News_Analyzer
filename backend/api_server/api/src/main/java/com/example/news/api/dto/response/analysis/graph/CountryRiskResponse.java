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
    private int articleCount;
    private Double avgSentiment;
    private Double coveragePercent;
}
