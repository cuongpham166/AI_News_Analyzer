package com.example.news.api.dto.response.analysis.graph;

public record CoOccurrenceCellResponse(
        String entityA,
        String typeA,
        String entityB,
        String typeB,
        long sharedCount,
        double avgSentiment
) {
}
