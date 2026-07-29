package com.example.news.api.dto.response.analysis.index;

import com.example.news.api.dto.internal.EntityDistribution;
import lombok.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MediaPulseOverviewResponse {
    private long totalArticles;
    private long uniqueStories;
    private double amplificationRatio;
    private Map<String, List<EntityDistribution>> entityBreakdown = new HashMap<>();
}
