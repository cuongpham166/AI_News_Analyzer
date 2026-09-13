package com.example.news.api.dto.internal.admin.metrics.pipeline.neo4j;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Neo4jPipelineRelationship {
    private String name;
    private long total;
}
