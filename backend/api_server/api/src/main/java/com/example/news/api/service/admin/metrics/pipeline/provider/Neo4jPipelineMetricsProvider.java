package com.example.news.api.service.admin.metrics.pipeline.provider;

import com.example.news.api.dto.internal.admin.metrics.pipeline.neo4j.Neo4jPipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.neo4j.Neo4jPipelineNode;
import com.example.news.api.dto.internal.admin.metrics.pipeline.neo4j.Neo4jPipelineRelationship;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class Neo4jPipelineMetricsProvider {
    private final Neo4jClient neo4jClient;

    public Neo4jPipelineMetricsProvider (Neo4jClient neo4jClient){
        this.neo4jClient = neo4jClient;
    }

    private long countTotalRelationships() {
        return neo4jClient
                .query("MATCH ()-[r]->() RETURN count(r) AS count")
                .fetchAs(Long.class)
                .one()
                .orElse(0L);
    }

    private long countTotalNodes() {
        return neo4jClient
                .query("MATCH (n) RETURN count(n) AS count")
                .fetchAs(Long.class)
                .one()
                .orElse(0L);
    }


    private List<Neo4jPipelineRelationship> getRelationshipStatistics() {
        return neo4jClient.query("""
                MATCH ()-[r]->()
                RETURN type(r) AS name, count(r) AS total
                ORDER BY total DESC
                """)
                .fetchAs(Neo4jPipelineRelationship.class)
                .mappedBy((typeSystem, record) ->
                        new Neo4jPipelineRelationship(
                                record.get("name").asString(),
                                record.get("total").asLong()
                        ))
                .all()
                .stream()
                .toList();
    }

    private List<Neo4jPipelineNode> getNodeStatistics() {
        return neo4jClient.query("""
                MATCH (n)
                UNWIND labels(n) AS label
                RETURN label AS name, count(n) AS total
                ORDER BY total DESC
                """)
                .fetchAs(Neo4jPipelineNode.class)
                .mappedBy((typeSystem, record) ->
                        new Neo4jPipelineNode(
                                record.get("name").asString(),
                                record.get("total").asLong()
                        ))
                .all()
                .stream()
                .toList();
    }

    public Neo4jPipelineMetrics getNeo4jPipelineMetrics () {
        return new Neo4jPipelineMetrics(
                countTotalNodes(),
                countTotalRelationships(),
                getNodeStatistics(),
                getRelationshipStatistics(),
                null
        );
    }
}
