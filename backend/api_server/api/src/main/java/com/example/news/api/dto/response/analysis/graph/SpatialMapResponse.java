package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SpatialMapResponse {
    private String location;
    private int count;
    private Double avgSentiment;
}
