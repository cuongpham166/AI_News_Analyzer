package com.example.news.api.util.query.analytics;

import org.springframework.stereotype.Component;

@Component
public class AnalyticsQuery {

    public AnalyticsQuery(){}

    public String getGlobalTrendsAnalyticsQuery() {
        return """
            WITH bucketed AS (
                SELECT %s AS bucket, topic_name, sentiment
                FROM news_analytics.news_analytics_flat
                WHERE publish_date >= {start:DateTime} AND publish_date <= {end:DateTime}
            ),
    
            bucket_stats AS (
                SELECT bucket, count() AS article_count, avg(ifNull(sentiment, 0.0)) AS average_sentiment
                FROM bucketed
                GROUP BY bucket
            ),
    
            topic_stats AS (
                SELECT bucket, topic_name, count() AS topic_count
                FROM bucketed
                WHERE topic_name IS NOT NULL AND topic_name != ''
                GROUP BY bucket, topic_name
            ),
    
            ranked_topics AS (
                SELECT bucket,topic_name, topic_count, row_number() OVER (
                    PARTITION BY bucket
                    ORDER BY topic_count DESC
                ) AS topic_rank
                FROM topic_stats
            )
    
            SELECT s.bucket, s.article_count, s.average_sentiment, r.topic_name, r.topic_count
            FROM bucket_stats s
            LEFT JOIN ranked_topics r ON s.bucket = r.bucket AND r.topic_rank <= 3
            ORDER BY s.bucket ASC, r.topic_rank ASC
        """;
    }


    public String getGlobalEntitiesTrendsAnalyticsQuery() {
        return """
            WITH entity_rows AS (
                SELECT %s AS bucket, news_id, sentiment, entity_name
                FROM news_analytics.news_analytics_flat
                ARRAY JOIN entities.name AS entity_name
                WHERE publish_date >= {start:DateTime} AND publish_date <= {end:DateTime}
                    AND entity_name IS NOT NULL AND entity_name != ''
            ),
            entity_news AS (
                SELECT bucket, news_id, entity_name, any(sentiment) AS sentiment
                FROM entity_rows
                GROUP BY bucket, news_id, entity_name
            ),
            entity_stats AS (
                SELECT bucket, entity_name, count() AS entity_count, avg(sentiment) AS average_sentiment
                FROM entity_news
                GROUP BY bucket, entity_name
            ),
            ranked_entities AS (
                SELECT bucket, entity_name, entity_count, average_sentiment,row_number() OVER (
                    PARTITION BY bucket
                    ORDER BY entity_count DESC, entity_name ASC
                ) AS entity_rank
                FROM entity_stats
            )
            SELECT bucket, entity_name, entity_count, average_sentiment
            FROM ranked_entities
            WHERE entity_rank <= 20
            ORDER BY bucket ASC, entity_rank ASC
        """;
    }
}
