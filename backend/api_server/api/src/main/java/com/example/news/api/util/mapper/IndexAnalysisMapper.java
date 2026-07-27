package com.example.news.api.util.mapper;

import co.elastic.clients.elasticsearch._types.aggregations.Aggregate;
import co.elastic.clients.elasticsearch._types.aggregations.DateHistogramBucket;
import co.elastic.clients.elasticsearch._types.aggregations.StringTermsBucket;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.example.news.api.dto.internal.EntityCount;
import com.example.news.api.dto.internal.TopicDistribution;
import com.example.news.api.dto.internal.TrendBucket;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class IndexAnalysisMapper {
    public IndexAnalysisMapper(){}

    private double extractAverageSentiment(DateHistogramBucket bucket) {
        Aggregate agg = bucket.aggregations().get("avg_sentiment");
        if (agg == null) {
            return 0.0;
        }
        double avg = agg.avg().value();
        return Double.isNaN(avg) ? 0.0 : avg;
    }

    private Map<String, Long> extractTopTopics(DateHistogramBucket bucket){
        Aggregate agg = bucket.aggregations().get("top_topics");
        Map<String, Long> topicsMap = new HashMap<>();
        if(agg == null){
            return new HashMap<>();
        }
        List<StringTermsBucket> topicBuckets = agg.sterms().buckets().array();
        for (StringTermsBucket topicBucket : topicBuckets) {
            topicsMap.put(topicBucket.key().stringValue(), topicBucket.docCount());
        }
        return topicsMap;
    }

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

            long epochMillis = bucket.key();

            dtoBucket.setDate(sdf.format(new Date(epochMillis)));
            dtoBucket.setArticleCount(bucket.docCount());
            dtoBucket.setAverageSentiment(extractAverageSentiment(bucket));
            dtoBucket.setTopTopics(extractTopTopics(bucket));

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

            String dateKey = sdf.format(new Date(timeBucket.key()));

            List<EntityCount> entitiesForThisDate = new ArrayList<>();

            Aggregate nestedAgg = timeBucket.aggregations()
                    .get("entities");

            List<StringTermsBucket> entityBuckets = nestedAgg
                    .nested()
                    .aggregations()
                    .get("top_entities")
                    .sterms()
                    .buckets()
                    .array();

            for (StringTermsBucket entityBucket : entityBuckets) {
                EntityCount entityDTO = new EntityCount();

                entityDTO.setName(entityBucket.key().stringValue());
                entityDTO.setCount(entityBucket.docCount());

                // Read avg sentiment from reverse_nested -> avg_sentiment
                Aggregate reverseNestedAgg = entityBucket.aggregations()
                        .get("to_news");

                if (reverseNestedAgg != null &&
                        reverseNestedAgg.reverseNested().aggregations()
                                .containsKey("avg_sentiment")) {

                    double avg = reverseNestedAgg.reverseNested()
                            .aggregations()
                            .get("avg_sentiment")
                            .avg()
                            .value();

                    entityDTO.setAverageSentiment(
                            Double.isNaN(avg) ? 0.0 : avg
                    );
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


        long totalCount = response.hits().total() != null ?
                response.hits().total().value() : 0;

        result.setDistribution(topicDistributionEntities);
        result.setCount(totalCount);

        return result;
    }


}
