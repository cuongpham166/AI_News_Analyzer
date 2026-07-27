package com.example.news.api.service.analysis;

import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
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

}
