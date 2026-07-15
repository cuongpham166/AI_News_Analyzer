package com.example.news.api.service.news;

import com.example.news.api.dto.response.news.RecommendedNewsResponse;
import com.example.news.api.repository.UserInteractionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendationEngineService {
    private final UserInteractionRepository userInteractionRepository;

    public RecommendationEngineService(UserInteractionRepository userInteractionRepository){
        this.userInteractionRepository = userInteractionRepository;
    }
    public List<RecommendedNewsResponse>getPersonalizedFeed(String userId, int limit) {
        //Fetch the summary_embeddings of news items the user enjoys
        List<float[]> historicalVectors = userInteractionRepository.getHistoricalEmbeddingsForUser(userId);
        if (historicalVectors.isEmpty()) {
            return new ArrayList<>();
        }

        //Calculate the average vector representing the user's taste
        float[] userProfileVector = calculateMeanVector(historicalVectors);
        return userInteractionRepository.getVectorRecommendations(userId, userProfileVector, limit);
    }

    private float[] calculateMeanVector(List<float[]> vectors) {
        final int NOMIC_DIMENSIONS = 768;
        float[] meanVector = new float[NOMIC_DIMENSIONS];

        for (float[] v : vectors) {
            for (int i = 0; i < NOMIC_DIMENSIONS; i++) {
                meanVector[i] += v[i];
            }
        }

        for (int i = 0; i < NOMIC_DIMENSIONS; i++) {
            meanVector[i] /= vectors.size();
        }

        return meanVector;
    }

}
