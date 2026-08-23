package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.response.analysis.index.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MacroPulseDetailResponse {
    private SentimentVolumeTimelineResponse sentimentVolumeTimeline;
    private GlobalTrendsResponse globalTrend;
    private GlobalEntityTrendsResponse globalEntityTrend;
    private List<EntityVelocityResponse> entityVelocity;
    private List<SignificantTermsAggregationResponse> significantTerms;
    private TopRadarResponse topicRadar;
}
