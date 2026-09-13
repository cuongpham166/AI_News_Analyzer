package com.example.news.api.dto.response.admin.metrics;

import com.example.news.api.dto.internal.admin.metrics.pipeline.PostgresPipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.clickhouse.ClickHousePipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.elasticsearch.ElasticsearchPipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.neo4j.Neo4jPipelineMetrics;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PipelineMetricsResponse {
    private PostgresPipelineMetrics postgresPipelineMetrics;
    private Neo4jPipelineMetrics neo4jPipelineMetrics;
    private ElasticsearchPipelineMetrics elasticsearchPipelineMetrics;
    private ClickHousePipelineMetrics clickHousePipelineMetrics;
    private boolean isPostgresOnline;
    private boolean isNeo4jOnline;
    private boolean isElasticSearchOnline;
    private boolean isClickHouseOnline;

}
