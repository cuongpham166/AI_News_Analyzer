package com.example.news.api.service.admin.metrics.pipeline.provider;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.cluster.HealthResponse;
import co.elastic.clients.elasticsearch.indices.IndicesStatsResponse;
import com.example.news.api.dto.internal.admin.metrics.pipeline.elasticsearch.ElasticsearchIndexStatistics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.elasticsearch.ElasticsearchPipelineMetrics;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class ElasticsearchPipelineMetricsProvider {
    private final ElasticsearchClient elasticsearchClient;

    public ElasticsearchPipelineMetricsProvider(ElasticsearchClient elasticsearchClient){
        this.elasticsearchClient = elasticsearchClient;
    }

    private long parseLong(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }

        return Long.parseLong(value);
    }

    public ElasticsearchPipelineMetrics getElasticSearchPipelineMetrics() {
        try{
            HealthResponse health = elasticsearchClient.cluster().health();
            IndicesStatsResponse indexStats = elasticsearchClient.indices().stats();

            List<ElasticsearchIndexStatistics> indices = indexStats.indices()
                    .entrySet()
                    .stream()
                    .map(entry -> {
                        String indexName = entry.getKey();
                        var stats = entry.getValue();
                        long documents = stats.primaries()
                                .docs()
                                .count();

                        long sizeInBytes = stats.primaries()
                                .store()
                                .sizeInBytes();

                        return new ElasticsearchIndexStatistics(
                                indexName,
                                documents,
                                sizeInBytes
                        );
                    })
                    .toList();

            long totalDocuments = indices.stream()
                    .mapToLong(ElasticsearchIndexStatistics::getDocuments)
                    .sum();

            return new ElasticsearchPipelineMetrics(
                    health.status().jsonValue(),
                    health.numberOfNodes(),
                    health.numberOfDataNodes(),
                    health.activeShards(),
                    health.unassignedShards(),
                    indices.size(),
                    totalDocuments,
                    indices,
                    null
            );
        }catch (Exception e) {
            return new ElasticsearchPipelineMetrics(
                    "DOWN",
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    List.of(),
                    null
            );
        }
    }
}

