package com.example.news.api.util.mapper;

import co.elastic.clients.elasticsearch._types.aggregations.*;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import com.example.news.api.dto.internal.*;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.*;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
        List<StringTermsBucket> topicBuckets = agg.sterms()
                .buckets()
                .array();

        for (StringTermsBucket topicBucket : topicBuckets) {
            topicsMap.put(topicBucket.key().stringValue(), topicBucket.docCount());
        }
        return topicsMap;
    }

    private double calculateVelocity(long current, long previous) {
        if (previous == 0) {
            return current * 100.0;
        }
        double change = (double) (current - previous) / previous * 100.0;
        return BigDecimal.valueOf(change)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
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

    public List<EchoChamberResponse> mapEchoChamber(SearchResponse<ObjectNode> response) {
        List<EchoChamberResponse> results = new ArrayList<>();

        if (response == null || response.aggregations() == null) {
            return results;
        }

        var agg = response.aggregations().get("duplicated_clusters");
        if (agg == null || !agg.isSterms()) {
            return results;
        }

        List<StringTermsBucket> clusterBuckets = agg.sterms().buckets().array();

        for (StringTermsBucket clusterBucket : clusterBuckets) {
            EchoChamberResponse dto = new EchoChamberResponse();

            dto.setContentHash(clusterBucket.key().stringValue());
            dto.setTotalDuplications(clusterBucket.docCount());

            String sampleTitle = "No Title Available";
            var subAggs = clusterBucket.aggregations();

            // 1. Extract sample title from topHits
            if (subAggs != null && subAggs.containsKey("sample_title")) {
                TopHitsAggregate topHits = subAggs.get("sample_title").topHits();
                if (topHits != null && topHits.hits() != null && !topHits.hits().hits().isEmpty()) {
                    Hit<JsonData> firstHit = topHits.hits().hits().get(0);
                    if (firstHit.source() != null) {
                        ObjectNode sourceNode = firstHit.source().to(ObjectNode.class);
                        if (sourceNode != null && sourceNode.has("title")) {
                            sampleTitle = sourceNode.get("title").asText();
                        }
                    }
                }
            }

            // 2. Extract publisher breakdown
            List<PublisherDistribution> publishers = new ArrayList<>();
            if (subAggs != null && subAggs.containsKey("publishers")) {
                var pubAgg = subAggs.get("publishers");
                if (pubAgg.isSterms() && pubAgg.sterms().buckets() != null) {
                    for (StringTermsBucket pubBucket : pubAgg.sterms().buckets().array()) {
                        publishers.add(new PublisherDistribution(
                                pubBucket.key().stringValue(),
                                pubBucket.docCount()
                        ));
                    }
                }
            }

            dto.setSampleTitle(sampleTitle);
            dto.setPublishers(publishers);
            results.add(dto);
        }

        return results;
    }

    public List<EntityVelocityResponse> mapEntityVelocity(SearchResponse<ObjectNode> response) {
        List<EntityVelocityResponse> results = new ArrayList<>();

        if (response == null || response.aggregations() == null) {
            return results;
        }

        Aggregate entitiesAgg = response
                .aggregations()
                .get("entities");

        if (entitiesAgg == null || !entitiesAgg.isNested()) {
            return results;
        }

        Aggregate entityNamesAgg = entitiesAgg
                .nested()
                .aggregations()
                .get("entity_names");

        if (entityNamesAgg == null || !entityNamesAgg.isSterms()) {
            return results;
        }

        List<StringTermsBucket> entityBuckets = entityNamesAgg
                .sterms()
                .buckets()
                .array();

        for (StringTermsBucket entityBucket : entityBuckets) {
            String entityName = entityBucket.key().stringValue();
            Map<String, Aggregate> subAggs = entityBucket.aggregations();

            long currentCount = 0;
            long previousCount = 0;
            
            if (subAggs != null && subAggs.containsKey("to_parent")) {
                Aggregate toParentAgg = subAggs.get("to_parent");

                if (toParentAgg != null && toParentAgg.isReverseNested()) {
                    Map<String, Aggregate> parentSubAggs = toParentAgg.reverseNested().aggregations();

                    if (parentSubAggs.containsKey("current_period")) {
                        Aggregate currentFilter = parentSubAggs.get("current_period");
                        if (currentFilter.isFilter()) {
                            currentCount = currentFilter.filter().docCount();
                        }
                    }

                    if (parentSubAggs.containsKey("previous_period")) {
                        Aggregate previousFilter = parentSubAggs.get("previous_period");
                        if (previousFilter.isFilter()) {
                            previousCount = previousFilter.filter().docCount();
                        }
                    }
                }
            }
            if (currentCount == 0 && previousCount == 0) {
                continue;
            }

            double velocityPercentage = calculateVelocity(currentCount, previousCount);
            results.add(new EntityVelocityResponse(
                    entityName,
                    currentCount,
                    previousCount,
                    velocityPercentage
            ));
        }
        results.sort((a, b) -> Long.compare(b.getCurrentMentions(), a.getCurrentMentions()));
        return results;
    }

    public MediaPulseOverviewResponse mapMediaPulseOverview(SearchResponse<ObjectNode> response) {
        MediaPulseOverviewResponse dto = new MediaPulseOverviewResponse();
        
        if (response == null || response.aggregations() == null) {
            return dto;
        }

        Map<String, Aggregate> aggs = response.aggregations();

        if (aggs.containsKey("total_articles")) {
            dto.setTotalArticles((long) aggs.get("total_articles").valueCount().value());
        }

        if (aggs.containsKey("unique_stories")) {
            dto.setUniqueStories((long) aggs.get("unique_stories").cardinality().value());
        }

        if (dto.getUniqueStories() > 0) {
            double ratio = (double) dto.getTotalArticles() / dto.getUniqueStories();
            dto.setAmplificationRatio(Math.round(ratio * 100.0) / 100.0);
        }

        Map<String, List<EntityDistribution>> entityBreakdown = new HashMap<>();

        if (aggs.containsKey("nested_entities")) {
            var nested = aggs.get("nested_entities").nested();
            if (nested.aggregations().containsKey("by_entity_type")) {
                StringTermsAggregate typeTerms = nested.aggregations().get("by_entity_type").sterms();

                for (StringTermsBucket typeBucket : typeTerms.buckets().array()) {
                    String entityType = typeBucket.key().stringValue().toLowerCase(); // e.g. "location", "person"
                    List<EntityDistribution> topValues = new ArrayList<>();

                    if (typeBucket.aggregations().containsKey("top_values")) {
                        StringTermsAggregate valTerms = typeBucket.aggregations().get("top_values").sterms();
                        for (StringTermsBucket valBucket : valTerms.buckets().array()) {
                            topValues.add(new EntityDistribution(
                                    valBucket.key().stringValue(),
                                    valBucket.docCount()
                            ));
                        }
                    }

                    entityBreakdown.put(entityType, topValues);
                }
            }
        }

        dto.setEntityBreakdown(entityBreakdown);
        return dto;
    }

    public List<SignificantTermsAggregationResponse> mapSignificantTerms(SearchResponse<ObjectNode> response) {
        List<SignificantTermsAggregationResponse> results = new ArrayList<>();

        if (response == null || response.aggregations() == null) {
            return results;
        }

        Aggregate nestedAgg = response
                .aggregations()
                .get("nested_entities");

        if (nestedAgg != null && nestedAgg.isNested()) {
            Map<String, Aggregate> subAggs = nestedAgg.nested().aggregations();

            if (subAggs != null && subAggs.containsKey("emerging_buzzwords")) {
                Aggregate sigAgg = subAggs.get("emerging_buzzwords");

                if (sigAgg != null && sigAgg.isSigsterms() && sigAgg.sigsterms().buckets() != null) {
                    for (var bucket : sigAgg.sigsterms().buckets().array()) {
                        results.add(new SignificantTermsAggregationResponse(
                                bucket.key(),
                                bucket.score(),
                                bucket.docCount(),
                                bucket.bgCount()
                        ));
                    }
                }
            }
        }

        results.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        return results;
    }

    public SentimentVolumeTimelineResponse mapSentimentVolumeTimeline(SearchResponse<ObjectNode> response) {
        List<TimelineBucket> timeline = new ArrayList<>();

        if (response == null || response.aggregations() == null) {
            return new SentimentVolumeTimelineResponse(timeline);
        }

        Aggregate agg = response.aggregations().get("articles_over_time");

        if (agg != null && agg.isDateHistogram() && agg.dateHistogram().buckets() != null) {
            for (var bucket : agg.dateHistogram().buckets().array()) {
                String timestamp = bucket.keyAsString();
                long articleCount = bucket.docCount();

                double avgSentiment = 0.0;
                if (bucket.aggregations().containsKey("avg_sentiment")) {
                    var avgAgg = bucket.aggregations().get("avg_sentiment").avg();
                    if (avgAgg != null && !Double.isNaN(avgAgg.value())) {
                        avgSentiment = Math.round(avgAgg.value() * 1000.0) / 1000.0;
                    }
                }

                Map<String, Long> sentimentBreakdown = new HashMap<>();
                if (bucket.aggregations().containsKey("sentiment_breakdown")) {
                    var termsAgg = bucket.aggregations().get("sentiment_breakdown").sterms();
                    if (termsAgg != null && termsAgg.buckets() != null) {
                        for (var termBucket : termsAgg.buckets().array()) {
                            sentimentBreakdown.put(
                                    termBucket.key().stringValue().toUpperCase(),
                                    termBucket.docCount()
                            );
                        }
                    }
                }

                timeline.add(new TimelineBucket(
                        timestamp,
                        articleCount,
                        avgSentiment,
                        sentimentBreakdown
                ));
            }


        }
        return new SentimentVolumeTimelineResponse(timeline);
    }
}
