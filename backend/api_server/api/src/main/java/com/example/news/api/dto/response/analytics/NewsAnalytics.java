package com.example.news.api.dto.response.analytics;

import com.example.news.api.dto.internal.analytics.EntityAnalytics;
import com.example.news.api.dto.internal.analytics.KeyphraseAnalytics;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record NewsAnalytics(
        UUID newsId,
        long sourceId,
        String sourceName,

        LocalDateTime publishDate,

        String language,
        String contentHash,

        float sentiment,
        String sentimentLabel,

        long topicId,
        String topicName,

        List<EntityAnalytics> entities,
        List<KeyphraseAnalytics> keyphrases
) {}
