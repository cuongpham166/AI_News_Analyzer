package com.example.news.api.dto.response.analysis.index;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignificantTermsAggregationResponse {
    private String term;
    private double score;
    private long docCount;
    private long bgCount;

    public double getHistoricalSharePercentage() {
        if (bgCount == 0 || bgCount <= docCount) {
            return 100.0;
        }
        double share = ((double) docCount / bgCount) * 100.0;
        return Math.round(share * 100.0) / 100.0;
    }

}
