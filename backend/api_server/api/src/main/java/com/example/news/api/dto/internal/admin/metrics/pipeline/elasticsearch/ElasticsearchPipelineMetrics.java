package com.example.news.api.dto.internal.admin.metrics.pipeline.elasticsearch;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ElasticsearchPipelineMetrics {
    private String status;

    private int numberOfNodes;
    private int numberOfDataNodes;

    private int activeShards;
    private int unassignedShards;

    private int numberOfIndices;
    private long totalDocuments;

    private List<ElasticsearchIndexStatistics> indices;
    private String errorMessage;

    public static ElasticsearchPipelineMetrics fallbackWithError(String error) {
        ElasticsearchPipelineMetrics metrics = new ElasticsearchPipelineMetrics();
        metrics.setStatus("");
        metrics.setNumberOfNodes(0);
        metrics.setNumberOfDataNodes(0);
        metrics.setActiveShards(0);
        metrics.setUnassignedShards(0);
        metrics.setNumberOfIndices(0);
        metrics.setTotalDocuments(0L);
        metrics.setIndices(List.of());
        metrics.setErrorMessage(error);
        return metrics;
    }

}
