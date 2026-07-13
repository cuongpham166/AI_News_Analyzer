package com.example.news.api.service;

import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.repository.GraphRecommendationRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.neo4j.core.Neo4jClient;
import java.util.Map;

@Service
public class GraphRecommendationService {
    private final GraphRecommendationRepository graphRecommendationRepository;

    public GraphRecommendationService(GraphRecommendationRepository graphRecommendationRepository){
        this.graphRecommendationRepository = graphRecommendationRepository;
    }

    public void syncBookmark(String userId, int newsId) {
        graphRecommendationRepository.syncBookmark(userId, newsId);
    }

    public void removeBookmark(String userId, int newsId){
        graphRecommendationRepository.removeBookmark(userId, newsId);
    }

    public void syncReaction(String userId, int newsId, ReactionType reactionType){
        graphRecommendationRepository.syncReaction(userId, newsId, reactionType);
    }

    public void removeReaction(String userId, int newsId){
        graphRecommendationRepository.removeReaction(userId, newsId);
    }
}
