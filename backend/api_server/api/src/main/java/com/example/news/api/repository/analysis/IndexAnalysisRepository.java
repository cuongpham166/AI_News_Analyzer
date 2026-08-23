package com.example.news.api.repository.analysis;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.ElasticsearchException;
import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.util.etc.IntervalConverter;
import com.example.news.api.util.mapper.IndexAnalysisMapper;
import com.example.news.api.util.query.IndexAnalysisQuery;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class IndexAnalysisRepository {
    private final ElasticsearchClient esClient;
    private final IntervalConverter aggInterval;
    private final IndexAnalysisQuery indexAnalysisQuery;
    private final IndexAnalysisMapper indexAnalysisMapper;
    public IndexAnalysisRepository(
            ElasticsearchClient esClient,
            IntervalConverter aggInterval,
            IndexAnalysisQuery indexAnalysisQuery,
            IndexAnalysisMapper indexAnalysisMapper
    ){
        this.esClient = esClient;
        this.aggInterval = aggInterval;
        this.indexAnalysisQuery = indexAnalysisQuery;
        this.indexAnalysisMapper = indexAnalysisMapper;
    }

    private SearchResponse<Void> executeGlobalTrendsSearch (long startEpoch,long endEpoch, CalendarInterval calendarInterval) throws IOException {
        //CalendarInterval intervalEnum = this.aggInterval.mapInterval(intervalUnit);
        SearchRequest searchRequest = indexAnalysisQuery.getGlobalTrendsRequest(startEpoch,endEpoch,calendarInterval);
        return esClient.search(searchRequest, Void.class);
    }

    private SearchResponse<Void> executeGlobalEntityTrendsSearch (long startEpoch,long endEpoch,  CalendarInterval calendarInterval) throws IOException {
        //CalendarInterval intervalEnum = this.aggInterval.mapInterval(intervalUnit);
        SearchRequest searchRequest = indexAnalysisQuery.getGlobalEntitiesTrendsRequest(startEpoch,endEpoch,calendarInterval);
        return esClient.search(searchRequest, Void.class);
    }

    private SearchResponse<Void> executeTopicRadarSearch(long startEpoch,long endEpoch) throws IOException {
        SearchRequest searchRequest = indexAnalysisQuery.getTopicRadarRequest(startEpoch,endEpoch);
        return esClient.search(searchRequest, Void.class);
    }

    private SearchResponse<ObjectNode> executeEchoChamberSearch(long startEpoch,long endEpoch,int minDocCount) throws IOException {
        SearchRequest searchRequest = indexAnalysisQuery.getEchoChamberRequest(startEpoch,endEpoch, minDocCount);
        return esClient.search(searchRequest,ObjectNode.class);
    }

    private SearchResponse<ObjectNode> executeEntityVelocitySearch(long startEpoch,long endEpoch,long previousStartEpoch) throws IOException {
        SearchRequest searchRequest = indexAnalysisQuery.getEntityVelocityRequest(startEpoch,endEpoch, previousStartEpoch);
        return esClient.search(searchRequest,ObjectNode.class);
    }

    private SearchResponse<ObjectNode>  executeMediaPulseOverviewSearch() throws IOException {
        SearchRequest searchRequest = indexAnalysisQuery.getMediaPulseOverviewRequest();
        return esClient.search(searchRequest,ObjectNode.class);
    }

    private SearchResponse<ObjectNode>  executeSignificantTermsAggregationSearch(long startEpoch,long endEpoch) throws IOException {
        SearchRequest searchRequest = indexAnalysisQuery.getSignificantTermsAggregationRequest(startEpoch, endEpoch);
        return esClient.search(searchRequest,ObjectNode.class);
    }

    private SearchResponse<ObjectNode>  executeSentimentVolumeTimelineSearch(long startEpoch,long endEpoch,CalendarInterval calendarInterval) throws IOException {
        SearchRequest searchRequest = indexAnalysisQuery.getSentimentVolumeTimelineRequest(startEpoch, endEpoch,calendarInterval);
        return esClient.search(searchRequest,ObjectNode.class);
    }

    private CalendarInterval parseCalendarInterval(String rawInput) {
        if (rawInput == null || rawInput.isBlank()) {
            return CalendarInterval.Day;
        }
        String normalized = rawInput.trim().toLowerCase();
        return switch (normalized) {
            case "minute", "m", "1m" -> CalendarInterval.Minute;
            case "hour", "h", "1h"   -> CalendarInterval.Hour;
            case "day", "d", "1d"    -> CalendarInterval.Day;
            case "week", "w", "1w"   -> CalendarInterval.Week;
            case "month", "M", "1M"  -> CalendarInterval.Month;
            case "quarter", "q"      -> CalendarInterval.Quarter;
            case "year", "y", "1y"   -> CalendarInterval.Year;
            default -> {
                for (CalendarInterval interval : CalendarInterval.values()) {
                    if (interval.name().equalsIgnoreCase(rawInput)) {
                        yield interval;
                    }
                }
                yield CalendarInterval.Day;
            }
        };
    }

    public GlobalTrendsResponse getGlobalTrendsWithRelativeInterval (String intervalUnit, int amount,String calendarInterval) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        CalendarInterval interval = parseCalendarInterval(calendarInterval);
        //SearchResponse<Void> response = executeGlobalTrendsSearch(startEpoch,endEpoch,intervalUnit);
        SearchResponse<Void> response = executeGlobalTrendsSearch(startEpoch,endEpoch,interval);
        return indexAnalysisMapper.mapGlobalTrends(response);
    }


    public GlobalEntityTrendsResponse getGlobalEntityWithRelativeInterval (String intervalUnit, int amount,String calendarInterval) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        CalendarInterval interval = parseCalendarInterval(calendarInterval);
        SearchResponse<Void> response = executeGlobalEntityTrendsSearch(startEpoch,endEpoch,interval);
        return indexAnalysisMapper.mapEntityAnalysis(response);
    }

    public List<InferenceNews> getImpactArticlesWithRelativeInterval(String intervalUnit, int amount, int topN, boolean isPositive) throws IOException {
        List<InferenceNews> allNews = new ArrayList<>();
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        SearchRequest searchRequest = indexAnalysisQuery.getImpactArticlesRequest(startEpoch,endEpoch,topN, isPositive);
        SearchResponse<InferenceNews> response = esClient.search(searchRequest, InferenceNews.class);

        for (Hit<InferenceNews> hit : response.hits().hits()) {
            allNews.add(hit.source());
        }
        return allNews;
    }

    public TopRadarResponse getTopicRadarWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        SearchResponse<Void> response = executeTopicRadarSearch(startEpoch,endEpoch);
        return indexAnalysisMapper.mapTopicRadar(response);
    }

    public List<EchoChamberResponse> getEchoChamberWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];

        SearchResponse<ObjectNode> response = executeEchoChamberSearch(startEpoch, endEpoch, 2);
        List<EchoChamberResponse> clusters = indexAnalysisMapper.mapEchoChamber(response);

        if (clusters.isEmpty()) {
            response = executeEchoChamberSearch(startEpoch, endEpoch, 1);
            clusters = indexAnalysisMapper.mapEchoChamber(response);
        }
        return clusters;
    }

    public List<EntityVelocityResponse> getEntityVelocityWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];

        long duration = endEpoch - startEpoch;
        long previousStartEpoch = startEpoch - duration;

        SearchResponse<ObjectNode> response = executeEntityVelocitySearch(startEpoch, endEpoch, previousStartEpoch);
        return indexAnalysisMapper.mapEntityVelocity(response);
    }


    public MediaPulseOverviewResponse getMediaPulseOverviewWithRelativeInterval () throws IOException {
        SearchResponse<ObjectNode> response = executeMediaPulseOverviewSearch();
        return indexAnalysisMapper.mapMediaPulseOverview(response);
    }

    public List<SignificantTermsAggregationResponse> getSignificantTermsAggregationWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        SearchResponse<ObjectNode> response = executeSignificantTermsAggregationSearch(startEpoch, endEpoch);
        return indexAnalysisMapper.mapSignificantTerms(response);
    }

    public SentimentVolumeTimelineResponse getSentimentVolumeTimelineWithRelativeInterval (String intervalUnit, int amount, String calendarInterval) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        CalendarInterval interval = parseCalendarInterval(calendarInterval);
        SearchResponse<ObjectNode> response = executeSentimentVolumeTimelineSearch(startEpoch, endEpoch, interval);
        return indexAnalysisMapper.mapSentimentVolumeTimeline(response);
    }

}
