package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MediaBiasResponse {
    private String source;
    private String topic;
    private int volume;
    private Double avgSentiment;
}
