package com.example.news.api.dto.internal.admin.metrics.pipeline.neo4j;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Neo4jPipelineMetrics {
    private long totalNodes;
    private long totalRelationships;
    private List<Neo4jPipelineNode> pipelineNodes;
    private List<Neo4jPipelineRelationship>pipelineRelationships;
    private String errorMessage;

    public static Neo4jPipelineMetrics fallbackWithError(String error) {
        Neo4jPipelineMetrics metrics = new Neo4jPipelineMetrics();
        metrics.setTotalNodes(0L);
        metrics.setTotalRelationships(0L);
        metrics.setPipelineNodes(List.of());
        metrics.setPipelineRelationships(List.of());
        metrics.setErrorMessage(error);
        return metrics;
    }
}
