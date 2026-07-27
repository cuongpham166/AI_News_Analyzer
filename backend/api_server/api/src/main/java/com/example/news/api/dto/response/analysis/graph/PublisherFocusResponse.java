package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PublisherFocusResponse {
    private String publisher;
    private String organization;
    private int coverageVolume;
    private Double volatility;
}
