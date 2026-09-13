package com.example.news.api.dto.internal.admin.metrics.pipeline;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PostgresPipelineMetrics {
    private long totalNews;
    private long totalInferenceNews;
    private long totalEntity;
    private long totalEntityType;
    private long totalKeyphrase;
    private long totalRssSource;
    private long totalTopic;
    private long totalSource;
    private String errorMessage;

    public static PostgresPipelineMetrics fallbackWithError(String error) {
        PostgresPipelineMetrics metrics = new PostgresPipelineMetrics();
        metrics.setTotalNews(0L);
        metrics.setTotalInferenceNews(0L);
        metrics.setTotalEntity(0L);
        metrics.setTotalEntityType(0L);
        metrics.setTotalKeyphrase(0L);
        metrics.setTotalRssSource(0L);
        metrics.setTotalTopic(0L);
        metrics.setTotalSource(0L);
        metrics.setErrorMessage(error);
        return metrics;
    }
}
