package com.example.news.api.service.admin.metrics.pipeline;

import com.example.news.api.dto.internal.admin.metrics.pipeline.PostgresPipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.clickhouse.ClickHousePipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.elasticsearch.ElasticsearchPipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.neo4j.Neo4jPipelineMetrics;
import com.example.news.api.dto.response.admin.metrics.PipelineMetricsResponse;
import com.example.news.api.service.admin.metrics.InfrastructureHealthService;
import com.example.news.api.service.admin.metrics.pipeline.provider.*;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Service
public class PipelineMetricsService {

    private final InfrastructureHealthService infrastructureHealthService;

    private final Executor ioExecutor;

    private final PostgresPipelineMetricsProvider postgresPipelineMetricsProvider;
    private final Neo4jPipelineMetricsProvider neo4jPipelineMetricsProvider;
    private final ElasticsearchPipelineMetricsProvider elasticsearchPipelineMetricsProvider;
    private final ClickHousePipelineMetricsProvider clickHousePipelineMetricsProvider;

    public PipelineMetricsService(
            InfrastructureHealthService infrastructureHealthService,
            Executor ioExecutor,
            PostgresPipelineMetricsProvider postgresPipelineMetricsProvider,
            Neo4jPipelineMetricsProvider neo4jPipelineMetricsProvider,
            ElasticsearchPipelineMetricsProvider elasticsearchPipelineMetricsProvider,
            ClickHousePipelineMetricsProvider clickHousePipelineMetricsProvider
    ){
        this.infrastructureHealthService = infrastructureHealthService;
        this.ioExecutor = ioExecutor;
        this.postgresPipelineMetricsProvider = postgresPipelineMetricsProvider;
        this.neo4jPipelineMetricsProvider = neo4jPipelineMetricsProvider;
        this.elasticsearchPipelineMetricsProvider = elasticsearchPipelineMetricsProvider;
        this.clickHousePipelineMetricsProvider = clickHousePipelineMetricsProvider;
    }

    @Cacheable(value = "pipeline_db_metrics", keyGenerator = "methodKeyGenerator")
    public PipelineMetricsResponse getPipelineMetrics () {
        CompletableFuture<PostgresPipelineMetrics> postgresFuture = CompletableFuture
                .supplyAsync(postgresPipelineMetricsProvider::getPostgresPipelineMetrics, ioExecutor)
                .exceptionally(ex -> PostgresPipelineMetrics.fallbackWithError(ex.getMessage()));

        CompletableFuture<Neo4jPipelineMetrics> neo4jFuture = CompletableFuture
                .supplyAsync(neo4jPipelineMetricsProvider::getNeo4jPipelineMetrics, ioExecutor)
                .exceptionally(ex -> Neo4jPipelineMetrics.fallbackWithError(ex.getMessage()));

        CompletableFuture<ElasticsearchPipelineMetrics> elasticsearchFuture = CompletableFuture
                .supplyAsync(elasticsearchPipelineMetricsProvider::getElasticSearchPipelineMetrics, ioExecutor)
                .exceptionally(ex -> ElasticsearchPipelineMetrics.fallbackWithError(ex.getMessage()));

        CompletableFuture<ClickHousePipelineMetrics> clickhouseFuture = CompletableFuture
                .supplyAsync(clickHousePipelineMetricsProvider::getClickHousePipelineMetrics, ioExecutor)
                .exceptionally(ex -> ClickHousePipelineMetrics.fallbackWithError(ex.getMessage()));

        CompletableFuture<Boolean> pgHealth = CompletableFuture.supplyAsync(() ->
                infrastructureHealthService.isHealthy("db"), ioExecutor
        );

        CompletableFuture<Boolean> neo4jHealth = CompletableFuture.supplyAsync(() ->
                infrastructureHealthService.isHealthy("neo4j"), ioExecutor
        );

        CompletableFuture<Boolean> esHealth = CompletableFuture.supplyAsync(() ->
                infrastructureHealthService.isHealthy("elasticsearch"), ioExecutor
        );

        CompletableFuture<Boolean> chHealth = CompletableFuture.supplyAsync(() ->
                infrastructureHealthService.isHealthy("clickhouse"), ioExecutor
        );

        CompletableFuture.allOf(
                postgresFuture,
                neo4jFuture,
                elasticsearchFuture,
                clickhouseFuture,
                pgHealth,
                neo4jHealth,
                esHealth,
                chHealth
        ).join();

        return new PipelineMetricsResponse(
                postgresFuture.join(),
                neo4jFuture.join(),
                elasticsearchFuture.join(),
                clickhouseFuture.join(),
                pgHealth.join(),
                neo4jHealth.join(),
                esHealth.join(),
                chHealth.join()
        );
    }
}
