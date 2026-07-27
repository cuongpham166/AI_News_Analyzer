package com.example.news.api.repository.analysis;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
import com.example.news.api.util.etc.IntervalConverter;
import com.example.news.api.util.mapper.IndexAnalysisMapper;
import com.example.news.api.util.query.IndexAnalysisQuery;
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

    private SearchResponse<Void> executeGlobalTrendsSearch (long startEpoch,long endEpoch, String intervalUnit) throws IOException {
        CalendarInterval intervalEnum = this.aggInterval.mapInterval(intervalUnit);
        SearchRequest searchRequest = indexAnalysisQuery.getGlobalTrendsRequest(startEpoch,endEpoch,intervalEnum);
        return esClient.search(searchRequest, Void.class);
    }

    private SearchResponse<Void> executeGlobalEntityTrendsSearch (long startEpoch,long endEpoch, String intervalUnit) throws IOException {
        CalendarInterval intervalEnum = this.aggInterval.mapInterval(intervalUnit);
        SearchRequest searchRequest = indexAnalysisQuery.getGlobalEntitiesTrendsRequest(startEpoch,endEpoch,intervalEnum);
        return esClient.search(searchRequest, Void.class);
    }

    private SearchResponse<Void> executeTopicRadarSearch(long startEpoch,long endEpoch) throws IOException {
        SearchRequest searchRequest = indexAnalysisQuery.getTopicRadarRequest(startEpoch,endEpoch);
        return esClient.search(searchRequest, Void.class);
    }

    public GlobalTrendsResponse getGlobalTrendsWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        SearchResponse<Void> response = executeGlobalTrendsSearch(startEpoch,endEpoch,intervalUnit);
        return indexAnalysisMapper.mapGlobalTrends(response);
    }


    public GlobalEntityTrendsResponse getGlobalEntityWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        long[] result = this.aggInterval.computeEpochRangeRelative(intervalUnit,amount);
        long startEpoch = result[0];
        long endEpoch   = result[1];
        SearchResponse<Void> response = executeGlobalEntityTrendsSearch(startEpoch,endEpoch,intervalUnit);
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

}
