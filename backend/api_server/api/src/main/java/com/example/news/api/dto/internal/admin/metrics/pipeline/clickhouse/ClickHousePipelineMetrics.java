package com.example.news.api.dto.internal.admin.metrics.pipeline.clickhouse;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ClickHousePipelineMetrics {
    private long totalArticles;
    private long uniqueSources;
    private long uniqueTopics;
    private long uniqueLanguages;
    private long uniqueContentHashes;
    private long duplicateArticles;

    private LocalDateTime oldestArticle;
    private LocalDateTime newestArticle;

    private double averageSentiment;

    private List<ClickHouseStatistic> sources;
    private List<ClickHouseStatistic> topics;
    private List<ClickHouseStatistic> languages;
    private List<ClickHouseStatistic> sentiments;

    private long totalEntities;
    private long uniqueEntities;
    private List<ClickHouseStatistic> entities;
    private List<ClickHouseStatistic> entityTypes;

    private long totalKeyphrases;
    private long uniqueKeyphrases;
    private List<ClickHouseStatistic> keyphrases;

    private long tableSizeBytes;
    private long parts;

    private String errorMessage;

    public static ClickHousePipelineMetrics fallbackWithError(String error) {
        ClickHousePipelineMetrics metrics = new ClickHousePipelineMetrics();
        metrics.setTotalArticles(0L);
        metrics.setUniqueSources(0L);
        metrics.setUniqueTopics(0L);
        metrics.setUniqueLanguages(0L);
        metrics.setUniqueContentHashes(0L);
        metrics.setDuplicateArticles(0L);

        metrics.setOldestArticle(LocalDateTime.now());
        metrics.setNewestArticle(LocalDateTime.now());

        metrics.setAverageSentiment(0L);

        metrics.setSources(List.of());
        metrics.setTopics(List.of());
        metrics.setLanguages(List.of());
        metrics.setSentiments(List.of());

        metrics.setTotalEntities(0L);
        metrics.setUniqueEntities(0L);
        metrics.setEntities(List.of());
        metrics.setEntityTypes(List.of());

        metrics.setTotalKeyphrases(0L);
        metrics.setUniqueKeyphrases(0L);
        metrics.setKeyphrases(List.of());

        metrics.setTableSizeBytes(0L);
        metrics.setParts(0L);

        metrics.setErrorMessage(error);
        return metrics;
    }
}
