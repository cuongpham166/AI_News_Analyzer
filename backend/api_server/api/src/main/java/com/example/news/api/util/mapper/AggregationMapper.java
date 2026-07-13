package com.example.news.api.util.mapper;

import java.util.*;

import com.example.news.api.dto.internal.EntityCount;
import com.example.news.api.dto.internal.Neo4jEntity;
import com.example.news.api.dto.internal.TopicDistribution;
import com.example.news.api.dto.internal.TrendBucket;
import com.example.news.api.dto.response.analysis.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.GlobalTrendsResponse;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.VolatilityIndexResponse;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import co.elastic.clients.elasticsearch.core.*;
import co.elastic.clients.elasticsearch._types.aggregations.DateHistogramBucket;
import co.elastic.clients.elasticsearch._types.aggregations.StringTermsBucket;

import com.example.news.api.dto.response.news.DetailedNewsResponse;

@Component
public class AggregationMapper {

    public AggregationMapper(){}

    public GlobalTrendsResponse mapGlobalTrends(SearchResponse<Void> response) {
        List<TrendBucket> trendBuckets = new ArrayList<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

        if (response.aggregations() == null || !response.aggregations().containsKey("trends_over_time")) {
            return new GlobalTrendsResponse(Collections.emptyList());
        }

        List<DateHistogramBucket> buckets = response.aggregations()
            .get("trends_over_time")
            .dateHistogram()
            .buckets()
            .array();

        for (DateHistogramBucket bucket : buckets) {
            TrendBucket dtoBucket = new TrendBucket();

            // Now bucket.key() is in MILLISECONDS because of our script above
            long epochMillis = bucket.key(); 
            
            // Format normally
            dtoBucket.setDate(sdf.format(new Date(epochMillis)));
            
            dtoBucket.setArticleCount(bucket.docCount());

            if (bucket.aggregations().containsKey("avg_sentiment")) {
                double avg = bucket.aggregations().get("avg_sentiment").avg().value();
                dtoBucket.setAverageSentiment(Double.isNaN(avg) ? 0.0 : avg);
            }

            if (bucket.aggregations().containsKey("top_topics")) {
                Map<String, Long> topicsMap = new HashMap<String, Long>();
                List<StringTermsBucket> topicBuckets = bucket.aggregations()
                    .get("top_topics")
                    .sterms()
                    .buckets()
                    .array();
                for (StringTermsBucket topicBucket : topicBuckets) {
                    topicsMap.put(topicBucket.key().stringValue(), topicBucket.docCount());
                }
                dtoBucket.setTopTopics(topicsMap);
            }
            trendBuckets.add(dtoBucket);
        }
        GlobalTrendsResponse dto = new GlobalTrendsResponse();
        dto.setTimeline(trendBuckets);
        return dto;
    }

    public GlobalEntityTrendsResponse mapEntityAnalysis(SearchResponse<Void> response) {
        GlobalEntityTrendsResponse result = new GlobalEntityTrendsResponse();
        Map<String, List<EntityCount>> timeline = new LinkedHashMap<>();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));

        List<DateHistogramBucket> timeBuckets = response.aggregations()
            .get("trends_entities_over_time")
            .dateHistogram()
            .buckets()
            .array();

        for (DateHistogramBucket timeBucket : timeBuckets) {
            // Convert the bucket key (millis) to a date string
            String dateKey = sdf.format(new Date(timeBucket.key()));
            List<EntityCount> entitiesForThisDate = new ArrayList<>();
            
            List<StringTermsBucket> entityBuckets = timeBucket.aggregations()
                .get("top_entities_per_period")
                .sterms()
                .buckets()
                .array();

            for (StringTermsBucket entityBucket : entityBuckets) {
                EntityCount entityDTO = new EntityCount();
                entityDTO.setName(entityBucket.key().stringValue());
                entityDTO.setCount(entityBucket.docCount());

                if (entityBucket.aggregations().containsKey("avg_sentiment")) {
                    double avg = entityBucket.aggregations().get("avg_sentiment").avg().value();
                    entityDTO.setAverageSentiment(Double.isNaN(avg) ? 0.0 : avg);
                }

                entitiesForThisDate.add(entityDTO);
            }
            timeline.put(dateKey, entitiesForThisDate);
        }
        result.setTimeline(timeline);
        return result;
    }
    
    public TopRadarResponse mapTopicRadar(SearchResponse<Void> response) {
        TopRadarResponse result = new TopRadarResponse();
        List<TopicDistribution> topicDistributionEntities = new ArrayList<>();

        List<StringTermsBucket> topicBuckets = response.aggregations()
            .get("topic_distribution")
            .sterms()
            .buckets()
            .array();

        for (StringTermsBucket topicBucket : topicBuckets) {
            TopicDistribution topicDTO = new TopicDistribution();
            topicDTO.setName(topicBucket.key().stringValue());
            topicDTO.setCount(topicBucket.docCount());
            topicDistributionEntities.add(topicDTO);
        }

        long totalCount = response.hits().total().value();

        result.setDistribution(topicDistributionEntities);
        result.setCount(totalCount);

        return result;
    }

    public DetailedNewsResponse mapDetailedNews (ResultSet rs) throws SQLException {
        DetailedNewsResponse news = new DetailedNewsResponse();
        news.setId(rs.getInt("id"));
        news.setTitle(rs.getString("title"));
        news.setPublishDate(rs.getTimestamp("publish_date"));
        news.setLink(rs.getString("link"));
        news.setLanguage(rs.getString("lang"));
        news.setSummary(rs.getString("summary"));
        news.setSentimentLabel(rs.getString("sentiment_label"));
        news.setSentiment(rs.getBigDecimal("sentiment"));
        news.setTopicId(rs.getInt("topic_id"));
        news.setSourceId(rs.getInt("source_id"));
        news.setTopic_name(rs.getString("topic_name"));
        news.setSource_name(rs.getString("source_name"));
        return news;
    }


    public VolatilityIndexResponse mapDetailedVolatilityIndex(ResultSet rs) throws SQLException {
        VolatilityIndexResponse volatilityIndex = new VolatilityIndexResponse();
        volatilityIndex.setEntity_name(rs.getString("entity_name"));
        volatilityIndex.setMentions(rs.getInt("mentions"));
        volatilityIndex.setAvg_sentiment(rs.getFloat("avg_sentiment"));
        volatilityIndex.setVolatility(rs.getFloat("volatility"));
        return volatilityIndex;
    }
    
    public Neo4jEntity mapNeo4jEntity(ResultSet rs) throws SQLException {
        Neo4jEntity neo4jEntity = new Neo4jEntity();
        neo4jEntity.setEntity_name(rs.getString("entity_name"));
        neo4jEntity.setNews_link(rs.getString("news_link"));
        return neo4jEntity;
    }
}
