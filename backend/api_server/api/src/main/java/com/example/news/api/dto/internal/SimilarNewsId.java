package com.example.news.api.dto.internal;

public record SimilarNewsId(
        String id,
        double vectorScore,
        double rankingScore
) {
}