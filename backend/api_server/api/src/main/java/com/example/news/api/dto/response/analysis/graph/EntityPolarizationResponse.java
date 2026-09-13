package com.example.news.api.dto.response.analysis.graph;

public record EntityPolarizationResponse(
        String entity,
        String entityGroup,
        long totalArticles,
        long positiveCount,
        long negativeCount,
        double avgSentiment,
        double polarizationScore
) { }
