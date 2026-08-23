package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.response.analysis.graph.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RiskMapResponse {
    private List<GeopoliticalHotspotResponse> geoHotspot;
    private GeopoliticalMetricsResponse geoMetrics;
    private List<CountryRiskResponse> countryRisk;
    private List<SpatialMapResponse> spatialMap;
    private List<EventTrackerResponse> event;
    private EventTrackerMetricsResponse eventMetrics;
    //private List<CrisisAndRiskRadarResponse> crisis;
}
