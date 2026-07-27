package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CrisisAndRiskRadarResponse {
    private String event;
    private String organization;
    private String location;
    private int frequency;
    private Double avgSentiment;
}
