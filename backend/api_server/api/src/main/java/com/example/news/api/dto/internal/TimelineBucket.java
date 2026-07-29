package com.example.news.api.dto.internal;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TimelineBucket {
    private String timestamp;
    private long articleCount;
    private double averageSentiment;
    private Map<String, Long> sentimentBreakdown;
}
