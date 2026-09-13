package com.example.news.api.dto.internal.admin.metrics.application;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PostgresApplicationMetrics {
    private long totalBookmarks;
    private long totalReactions;
    private long totalDislikes;
    private long totalLikes;
    private String errorMessage;

    public static PostgresApplicationMetrics fallbackWithError(String error) {
        PostgresApplicationMetrics metrics = new PostgresApplicationMetrics();
        metrics.setTotalBookmarks(0L);
        metrics.setTotalReactions(0L);
        metrics.setTotalDislikes(0L);
        metrics.setTotalLikes(0L);
        metrics.setErrorMessage(error);
        return metrics;
    }

}
