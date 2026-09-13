package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PowerCouplesResponse {
    private String person;
    private String organization;
    private int strength;
    private int positiveCoOccurrences;
    private int negativeCoOccurrences;
    private Double avgSentiment;
    private Double volatility;
}
