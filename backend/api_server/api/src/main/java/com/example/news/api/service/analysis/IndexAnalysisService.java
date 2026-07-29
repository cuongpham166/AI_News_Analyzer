package com.example.news.api.service.analysis;

import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.repository.analysis.IndexAnalysisRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class IndexAnalysisService {
    private final IndexAnalysisRepository indexAnalysisRepository;

    public IndexAnalysisService(IndexAnalysisRepository indexAnalysisRepository){
        this.indexAnalysisRepository = indexAnalysisRepository;
    }

    public GlobalTrendsResponse getGlobalTrendsWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return  indexAnalysisRepository.getGlobalTrendsWithRelativeInterval(intervalUnit, amount);
    }

    public GlobalEntityTrendsResponse getGlobalEntityWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return indexAnalysisRepository.getGlobalEntityWithRelativeInterval(intervalUnit, amount);
    }

    public List<InferenceNews> getImpactArticlesWithRelativeInterval(String intervalUnit, int amount, int topN, boolean isPositive) throws IOException {
        return  indexAnalysisRepository.getImpactArticlesWithRelativeInterval(intervalUnit, amount, topN, isPositive);
    }

    public TopRadarResponse getTopicRadarWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return  indexAnalysisRepository.getTopicRadarWithRelativeInterval(intervalUnit, amount);
    }
    public List<EchoChamberResponse> getEchoChamberWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return indexAnalysisRepository.getEchoChamberWithRelativeInterval(intervalUnit, amount);
    }

    public List<EntityVelocityResponse> getEntityVelocityWithRelativeInterval (String intervalUnit, int amount) throws IOException{
        return indexAnalysisRepository.getEntityVelocityWithRelativeInterval(intervalUnit, amount);
    }

    public MediaPulseOverviewResponse getMediaPulseOverviewWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return indexAnalysisRepository.getMediaPulseOverviewWithRelativeInterval(intervalUnit, amount);
    }

    public List<SignificantTermsAggregationResponse> getSignificantTermsAggregationWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return  indexAnalysisRepository.getSignificantTermsAggregationWithRelativeInterval(intervalUnit, amount);
    }

    public SentimentVolumeTimelineResponse getSentimentVolumeTimelineWithRelativeInterval (String intervalUnit, int amount, String calendarInterval) throws IOException {
        return indexAnalysisRepository.getSentimentVolumeTimelineWithRelativeInterval(intervalUnit, amount, calendarInterval);
    }
}
