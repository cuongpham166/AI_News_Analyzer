package com.example.news.api.service;

import java.io.IOException;
import java.util.List;

import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.*;
import org.springframework.stereotype.Service;

import com.example.news.api.repository.analysis.RelationshipRepository;
import com.example.news.api.repository.analysis.SentimentRepository;
import com.example.news.api.repository.analysis.SpatialRepository;
import com.example.news.api.repository.analysis.TrendRepository;

@Service
public class AnalysisService {
    private final RelationshipRepository relationshipRepo;
    private final SpatialRepository spatialRepo;
    private final SentimentRepository sentimentRepo;
    private final TrendRepository trendRepo;

    public AnalysisService(
        RelationshipRepository relationshipRepo,
        SpatialRepository spatialRepo,
        SentimentRepository sentimentRepo,
        TrendRepository trendRepo
    ){
        this.relationshipRepo = relationshipRepo;
        this.spatialRepo = spatialRepo;
        this.sentimentRepo = sentimentRepo;
        this.trendRepo = trendRepo;
    }

    public List<SpatialMapResponse> getSpatialMapWithRelativeInterval (String intervalUnit, int amount) {
        return this.spatialRepo.getSpatialMapWithRelativeInterval(intervalUnit, amount);
    }

    public List<PowerCoupleResponse> getPowerCoupleWithRelativeInterval (String intervalUnit, int amount) {
        return this.relationshipRepo.getPowerCoupleWithRelativeInterval(intervalUnit, amount);
    }

    public List<EventTrackerResponse> getEventTrackerWithRelativeInterval (String intervalUnit, int amount) {
        return this.relationshipRepo.getEventTrackerWithRelativeInterval(intervalUnit, amount);
    }

    public List<VolatilityIndexResponse> getVolatilityIndexWithRelativeInterval (String intervalUnit, int amount) {
        return this.sentimentRepo.getVolatilityIndexWithRelativeInterval(intervalUnit, amount);
    }

    public GlobalTrendsResponse getGlobalTrendsWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return this.trendRepo.getGlobalTrendsWithRelativeInterval(intervalUnit,amount);
    }

    public GlobalEntityTrendsResponse getGlobalEntityWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return this.trendRepo.getGlobalEntityWithRelativeInterval(intervalUnit,amount);
    }

    public List<InferenceNews> getImpactArticlesWithRelativeInterval(String intervalUnit, int amount, int topN, boolean isPositive) throws IOException {
        return this.trendRepo.getImpactArticlesWithRelativeInterval(intervalUnit,amount,topN,isPositive);
    }

    public TopRadarResponse getTopicRadarWithRelativeInterval (String intervalUnit, int amount) throws IOException {
        return this.trendRepo.getTopicRadarWithRelativeInterval(intervalUnit, amount);
    }

    public GraphResponse getDiscoveryDataWithRelativeInterval(String intervalUnit, int amount){
        return this.relationshipRepo.getDiscoveryData(intervalUnit, amount);
    }
}
