package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NarrativeBridgeResponse {
    private String person;
    private String keyPhrase;
    private int frequency;
    private int positiveVolume;
    private int negativeVolume;
    private Double avgSentiment;
    private Double volatility;
    private Double stabilityScore;
}
