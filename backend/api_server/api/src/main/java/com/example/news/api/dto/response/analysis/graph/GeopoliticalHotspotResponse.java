package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GeopoliticalHotspotResponse {
    private String location;
    private String topic;
    private int articleCount;
    private Double avgSentiment;
}
