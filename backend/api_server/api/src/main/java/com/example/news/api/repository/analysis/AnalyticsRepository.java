package com.example.news.api.repository.analysis;

import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import com.clickhouse.client.api.data_formats.ClickHouseBinaryFormatReader;
import com.clickhouse.client.api.insert.InsertResponse;
import com.clickhouse.client.api.query.QueryResponse;
import com.clickhouse.client.api.query.QuerySettings;
import com.clickhouse.data.ClickHouseFormat;
import com.clickhouse.data.ClickHouseRecord;
import com.example.news.api.dto.internal.EntityCount;
import com.example.news.api.dto.internal.TrendBucket;
import com.example.news.api.dto.internal.analytics.EntityAnalytics;
import com.example.news.api.dto.internal.analytics.KeyphraseAnalytics;
import com.example.news.api.dto.response.analysis.index.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
import com.example.news.api.dto.response.analytics.NewsAnalytics;
import com.example.news.api.util.DateTimeInterval;
import com.example.news.api.util.etc.IntervalConverter;
import com.example.news.api.util.query.analytics.AnalyticsQuery;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;
import com.clickhouse.client.api.Client;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Repository
public class AnalyticsRepository {
    private final Client client;
    private final ObjectMapper objectMapper;
    private final IntervalConverter aggInterval;
    private final AnalyticsQuery analyticsQuery;
    private static final DateTimeFormatter CLICKHOUSE_DATETIME =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
                    .withZone(ZoneOffset.UTC);

    public AnalyticsRepository(
            Client client,
            ObjectMapper objectMapper,
            IntervalConverter aggInterval,
            AnalyticsQuery analyticsQuery
    ){
        this.client = client;
        this.objectMapper = objectMapper;
        this.aggInterval = aggInterval;
        this.analyticsQuery = analyticsQuery;
    }

    public void saveAll(List<NewsAnalytics> news) {
        if (news == null || news.isEmpty()) {
            return;
        }

        try {
            String data = news.stream()
                    .map(this::toClickHouseJson)
                    .reduce((a, b) -> a + "\n" + b)
                    .orElse("");

            try (InsertResponse ignored = client.insert(
                    "news_analytics.news_analytics_flat",
                    new ByteArrayInputStream(
                            data.getBytes(StandardCharsets.UTF_8)
                    ),
                    ClickHouseFormat.JSONEachRow
            ).get()) {
                // successful
            }

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to insert news analytics",
                    e
            );
        }
    }

    private String toClickHouseJson(NewsAnalytics news) {

        try {
            Map<String, Object> row = new LinkedHashMap<>();

            row.put("news_id", news.newsId());

            row.put("source_id", news.sourceId());
            row.put("source_name", news.sourceName());

            row.put("publish_date", news.publishDate());

            row.put("language", news.language());
            row.put("content_hash", news.contentHash());

            row.put("sentiment", news.sentiment());
            row.put("sentiment_label", news.sentimentLabel());

            row.put("topic_id", news.topicId());
            row.put("topic_name", news.topicName());

            row.put(
                    "entities.id",
                    news.entities().stream()
                            .map(EntityAnalytics::id)
                            .toList()
            );

            row.put(
                    "entities.name",
                    news.entities().stream()
                            .map(EntityAnalytics::name)
                            .toList()
            );

            row.put(
                    "entities.type",
                    news.entities().stream()
                            .map(EntityAnalytics::type)
                            .toList()
            );

            row.put(
                    "keyphrases.id",
                    news.keyphrases().stream()
                            .map(KeyphraseAnalytics::id)
                            .toList()
            );

            row.put(
                    "keyphrases.value",
                    news.keyphrases().stream()
                            .map(KeyphraseAnalytics::value)
                            .toList()
            );

            return objectMapper.writeValueAsString(row);

        } catch (JsonProcessingException e) {
            throw new RuntimeException(
                    "Failed to serialize news analytics",
                    e
            );
        }
    }


    private DateTimeInterval parseClickhouseCalendarInterval(String rawInput) {
        if (rawInput == null || rawInput.isBlank()) {
            return DateTimeInterval.MONTH;
        }

        return switch (rawInput.trim().toLowerCase()) {
            case "minute", "m", "1m" -> DateTimeInterval.MINUTE;
            case "hour", "h", "1h" -> DateTimeInterval.HOUR;
            case "day", "d", "1d" -> DateTimeInterval.DAY;
            case "week", "w", "1w" -> DateTimeInterval.WEEK;
            case "month", "1month" -> DateTimeInterval.MONTH;
            case "quarter", "q", "1q" -> DateTimeInterval.QUARTER;
            case "year", "y", "1y" -> DateTimeInterval.YEAR;
            default -> DateTimeInterval.DAY;
        };
    }

    private String getIntervalExpression(DateTimeInterval interval) {
        return switch (interval) {
            case MINUTE -> "toStartOfMinute(publish_date)";
            case HOUR -> "toStartOfHour(publish_date)";
            case DAY -> "toStartOfDay(publish_date)";
            case WEEK -> "toStartOfWeek(publish_date)";
            case MONTH -> "toStartOfMonth(publish_date)";
            case QUARTER -> "toStartOfQuarter(publish_date)";
            case YEAR -> "toStartOfYear(publish_date)";
        };
    }

    public GlobalTrendsResponse getAnalyticsGlobalTrendsWithRelativeInterval(
            String intervalUnit,
            int amount,
            String calendarInterval
    ) {
        Instant[] range = this.aggInterval.computeDateRangeRelative(intervalUnit, amount);
        DateTimeInterval interval = parseClickhouseCalendarInterval(calendarInterval);
        return executeGlobalTrendsQuery(range[0],range[1],interval);
    }

    public GlobalEntityTrendsResponse getAnalyticsGlobalEntitiesTrendsWithRelativeInterval(
            String intervalUnit,
            int amount,
            String calendarInterval
    ) {
        Instant[] range = this.aggInterval.computeDateRangeRelative(intervalUnit, amount);
        DateTimeInterval interval = parseClickhouseCalendarInterval(calendarInterval);
        return executeGlobalEntityTrendsQuery(range[0],range[1],interval);
    }

    private GlobalTrendsResponse executeGlobalTrendsQuery(Instant start, Instant end, DateTimeInterval interval) {
        String bucketExpression = getIntervalExpression(interval);

        String sql = analyticsQuery.getGlobalTrendsAnalyticsQuery().formatted(bucketExpression);

        Map<String, Object> queryParams = new LinkedHashMap<>();

        queryParams.put( "start", CLICKHOUSE_DATETIME.format(start));
        queryParams.put("end",CLICKHOUSE_DATETIME.format(end));

        Map<String, TrendBucket> buckets = new LinkedHashMap<>();

        try (
                QueryResponse response =client.query(sql,queryParams,new QuerySettings()).get();
                ClickHouseBinaryFormatReader reader = client.newBinaryFormatReader(response)
        ) {

            while (reader.hasNext()) {
                reader.next();

                String bucket = reader.getString("bucket");
                long articleCount =  reader.getLong("article_count");
                double averageSentiment = reader.getDouble("average_sentiment");
                String topicName = reader.getString("topic_name");

                TrendBucket trendBucket = buckets.computeIfAbsent(
                        bucket, key -> {
                            TrendBucket tb = new TrendBucket();
                            tb.setDate(key);
                            tb.setArticleCount(articleCount);
                            tb.setAverageSentiment(averageSentiment);
                            tb.setTopTopics(new LinkedHashMap<>());
                            return tb;
                        });

                if (topicName != null && !topicName.isBlank()) {
                    long topicCount = reader.getLong("topic_count");
                    trendBucket.getTopTopics().put(topicName,topicCount);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to execute global trends query",e);
        }

        GlobalTrendsResponse result = new GlobalTrendsResponse();
        result.setTimeline(new ArrayList<>(buckets.values()));
        return result;
    }

    private GlobalEntityTrendsResponse executeGlobalEntityTrendsQuery(Instant start, Instant end, DateTimeInterval interval) {
        String bucketExpression = getIntervalExpression(interval);

        String sql = analyticsQuery.getGlobalEntitiesTrendsAnalyticsQuery().formatted(bucketExpression);

        Map<String, Object> queryParams = new LinkedHashMap<>();

        queryParams.put( "start", CLICKHOUSE_DATETIME.format(start));
        queryParams.put("end",CLICKHOUSE_DATETIME.format(end));

        Map<String, List<EntityCount>> timeline = new LinkedHashMap<>();

        try (
                QueryResponse response =client.query(sql,queryParams,new QuerySettings()).get();
                ClickHouseBinaryFormatReader reader = client.newBinaryFormatReader(response)
        ) {
            while (reader.hasNext()) {
                reader.next();
                String bucket = reader.getString("bucket");
                String entityName = reader.getString("entity_name");
                long entityCount = reader.getLong("entity_count");
                double averageSentiment = reader.getDouble("average_sentiment");

                EntityCount entity = new EntityCount();
                entity.setName(entityName);
                entity.setCount(entityCount);
                entity.setAverageSentiment(Double.isNaN(averageSentiment)? 0.0: averageSentiment);

                timeline.computeIfAbsent(bucket, key -> new ArrayList<>()).add(entity);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to execute global entities trends query",e);
        }

        GlobalEntityTrendsResponse result = new GlobalEntityTrendsResponse();
        result.setTimeline(timeline);
        return result;
    }

    public void showDatabases() throws Exception {
        String sql = "SHOW DATABASES";

        try (QueryResponse response = client
                .query(sql)
                .get(10, TimeUnit.SECONDS)) {

            ClickHouseBinaryFormatReader reader =
                    client.newBinaryFormatReader(response);

            while (reader.hasNext()) {
                reader.next();
                String database = reader.getString("name");
                System.out.println("Database: " + database);
            }
        }
    }

    public void getArticle(long id) throws Exception {

        String sql = """
            SELECT id, title, views
            FROM articles
            WHERE id = {articleId:UInt64}
        """;

        Map<String, Object> params = Map.of("articleId", id);

        try (QueryResponse response = client
                .query(sql, params, new QuerySettings())
                .get(10, TimeUnit.SECONDS)) {

            ClickHouseBinaryFormatReader reader =
                    client.newBinaryFormatReader(response);

            while (reader.hasNext()) {
                reader.next();

                System.out.println(reader.getString("title"));
            }
        }
    }
}
