package com.example.news.api.repository.news.recommendation;

import com.example.news.api.dto.response.news.RecommendedNewsResponse;

import java.util.List;


public interface RecommendedNewsRepository {
    List<RecommendedNewsResponse> getVectorRecommendations(String userId, float[] userProfileVector, int limit);
    List<float[]> getHistoricalEmbeddingsForUser(String userId);
}
