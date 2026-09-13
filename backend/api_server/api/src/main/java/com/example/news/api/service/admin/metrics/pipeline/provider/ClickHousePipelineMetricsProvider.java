package com.example.news.api.service.admin.metrics.pipeline.provider;

import com.clickhouse.client.api.Client;
import com.clickhouse.client.api.query.GenericRecord;
import com.example.news.api.dto.internal.admin.metrics.pipeline.clickhouse.ClickHousePipelineMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.clickhouse.ClickHouseStatistic;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClickHousePipelineMetricsProvider {
    private static final String DATABASE = "news_analytics";
    private static final String TABLE = "news_analytics_flat";

    private final Client clickHouseClient;

    public ClickHousePipelineMetricsProvider(Client clickHouseClient){
        this.clickHouseClient = clickHouseClient;
    }

    private List<ClickHouseStatistic> executeStatisticQuery(String sql) {
        return clickHouseClient
                .queryAll(sql)
                .stream()
                .map(row -> new ClickHouseStatistic(
                        row.getString("name"),
                        row.getLong("total")
                ))
                .toList();
    }

    public ClickHousePipelineMetrics getClickHousePipelineMetrics(){
        ClickHousePipelineMetrics clickHousePipelineMetrics = new ClickHousePipelineMetrics();

        loadGeneralStatistics(clickHousePipelineMetrics);
        loadDistributions(clickHousePipelineMetrics);
        loadEntityStatistics(clickHousePipelineMetrics);
        loadKeyphraseStatistics(clickHousePipelineMetrics);
        loadStorageStatistics(clickHousePipelineMetrics);

        return  clickHousePipelineMetrics;
    }

    private void loadGeneralStatistics(ClickHousePipelineMetrics clickHousePipelineMetrics){
        String sql = """
                SELECT
                    count() AS total_articles,
                    uniq(source_id) AS unique_sources,
                    uniq(topic_id) AS unique_topics,
                    uniq(language) AS unique_languages,
                    uniq(content_hash) AS unique_content_hashes,
                    count() - uniq(content_hash) AS duplicate_articles,
                    min(publish_date) AS oldest_article,
                    max(publish_date) AS newest_article,
                    avg(sentiment) AS average_sentiment
                FROM %s
                """.formatted(TABLE);

        GenericRecord row = clickHouseClient.queryAll(sql).get(0);

        clickHousePipelineMetrics.setTotalArticles(row.getLong("total_articles"));
        clickHousePipelineMetrics.setUniqueSources(row.getLong("unique_sources"));
        clickHousePipelineMetrics.setUniqueTopics(row.getLong("unique_topics"));
        clickHousePipelineMetrics.setUniqueLanguages(row.getLong("unique_languages"));
        clickHousePipelineMetrics.setUniqueContentHashes(row.getLong("unique_content_hashes"));
        clickHousePipelineMetrics.setDuplicateArticles(row.getLong("duplicate_articles"));
        clickHousePipelineMetrics.setOldestArticle(row.getLocalDateTime("oldest_article"));
        clickHousePipelineMetrics.setNewestArticle(row.getLocalDateTime("newest_article"));
        clickHousePipelineMetrics.setAverageSentiment(row.getDouble("average_sentiment"));
    }

    private void loadDistributions(ClickHousePipelineMetrics clickHousePipelineMetrics){
        clickHousePipelineMetrics.setSources(
                executeStatisticQuery("""
                        SELECT
                            source_name AS name,
                            count() AS total
                        FROM %s
                        GROUP BY source_name
                        ORDER BY total DESC
                        """.formatted(TABLE))
        );

        clickHousePipelineMetrics.setTopics(
                executeStatisticQuery("""
                        SELECT
                            topic_name AS name,
                            count() AS total
                        FROM %s
                        GROUP BY topic_name
                        ORDER BY total DESC
                        """.formatted(TABLE))
        );

        clickHousePipelineMetrics.setLanguages(
                executeStatisticQuery("""
                        SELECT
                            language AS name,
                            count() AS total
                        FROM %s
                        GROUP BY language
                        ORDER BY total DESC
                        """.formatted(TABLE))
        );

        clickHousePipelineMetrics.setSentiments(
                executeStatisticQuery("""
                        SELECT
                            sentiment_label AS name,
                            count() AS total
                        FROM %s
                        GROUP BY sentiment_label
                        ORDER BY total DESC
                        """.formatted(TABLE))
        );
    }

    private void loadEntityStatistics(ClickHousePipelineMetrics clickHousePipelineMetrics){
        GenericRecord totals = clickHouseClient
                .queryAll("""
                        SELECT
                            count() AS total_entities,
                            uniq(entity_name) AS unique_entities
                        FROM %s
                        ARRAY JOIN entities.name AS entity_name
                        """.formatted(TABLE))
                .get(0);

        clickHousePipelineMetrics.setTotalEntities(totals.getLong("total_entities"));

        clickHousePipelineMetrics.setUniqueEntities(totals.getLong("unique_entities"));

        clickHousePipelineMetrics.setEntities(
                executeStatisticQuery("""
                        SELECT
                            entity_name AS name,
                            count() AS total
                        FROM %s
                        ARRAY JOIN entities.name AS entity_name
                        GROUP BY entity_name
                        ORDER BY total DESC
                        LIMIT 100
                        """.formatted(TABLE))
        );

        clickHousePipelineMetrics.setEntityTypes(
                executeStatisticQuery("""
                        SELECT
                            entity_type AS name,
                            count() AS total
                        FROM %s
                        ARRAY JOIN entities.type AS entity_type
                        GROUP BY entity_type
                        ORDER BY total DESC
                        """.formatted(TABLE))
        );
    }

    private void loadKeyphraseStatistics(ClickHousePipelineMetrics clickHousePipelineMetrics){
        GenericRecord totals = clickHouseClient
                .queryAll("""
                        SELECT
                            count() AS total_keyphrases,
                            uniq(keyphrase) AS unique_keyphrases
                        FROM %s
                        ARRAY JOIN keyphrases.value AS keyphrase
                        """.formatted(TABLE))
                .get(0);

        clickHousePipelineMetrics.setTotalKeyphrases(totals.getLong("total_keyphrases"));

        clickHousePipelineMetrics.setUniqueKeyphrases(totals.getLong("unique_keyphrases"));

        clickHousePipelineMetrics.setKeyphrases(
                executeStatisticQuery("""
                        SELECT
                            keyphrase AS name,
                            count() AS total
                        FROM %s
                        ARRAY JOIN keyphrases.value AS keyphrase
                        GROUP BY keyphrase
                        ORDER BY total DESC
                        LIMIT 100
                        """.formatted(TABLE))
        );
    }

    private void loadStorageStatistics(ClickHousePipelineMetrics clickHousePipelineMetrics){
        GenericRecord row = clickHouseClient
                .queryAll("""
                        SELECT
                            sum(bytes_on_disk) AS table_size_bytes,
                            count() AS parts
                        FROM system.parts
                        WHERE database = 'news_analytics'
                          AND table = 'news_analytics_flat'
                          AND active
                        """)
                .get(0);

        clickHousePipelineMetrics.setTableSizeBytes(row.getLong("table_size_bytes"));

        clickHousePipelineMetrics.setParts(row.getLong("parts"));
    }
}
