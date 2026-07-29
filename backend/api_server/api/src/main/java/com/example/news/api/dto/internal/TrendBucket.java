package com.example.news.api.dto.internal;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TrendBucket {
    private String date; // e.g., "2026-04-13"
    private long articleCount;
    private double averageSentiment;
    private Map<String, Long> topTopics;

}
