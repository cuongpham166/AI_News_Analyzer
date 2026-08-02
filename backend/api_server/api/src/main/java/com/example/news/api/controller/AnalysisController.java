package com.example.news.api.controller;
import java.io.IOException;
import java.util.List;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.*;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.service.LocationService;
import com.example.news.api.service.analysis.GraphAnalysisService;
import com.example.news.api.service.analysis.IndexAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    private final GraphAnalysisService graphAnalysisService;
    private final IndexAnalysisService indexAnalysisService;
    private final LocationService locationService;
    public AnalysisController(
            GraphAnalysisService graphAnalysisService,
            IndexAnalysisService indexAnalysisService,
            LocationService locationService
    ) {
        this.graphAnalysisService = graphAnalysisService;
        this.indexAnalysisService = indexAnalysisService;
        this.locationService = locationService;
    }

    @Operation(summary = "Visualizes strong directional entity pairings and connection pathways using flow-based Sankey diagrams.")
    @GetMapping("/power_couple")
    public ResponseEntity<ApiResponse<List<PowerCouplesResponse>>> getPowerCoupleWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<PowerCouplesResponse> data = graphAnalysisService.getPowerCoupleWithRelativeInterval(intervalUnit,amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Organizes news events chronologically along a vertical map timeline to reconstruct key incident progressions.\n")
    @GetMapping("/event_tracker")
    public ResponseEntity<ApiResponse<List<EventTrackerResponse>>> getEventTrackerWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EventTrackerResponse> data = graphAnalysisService.getEventTrackerWithRelativeInterval(intervalUnit,amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Renders a country-level choropleth map that highlights regional risk, conflict exposure, and country-specific coverage volume.\n")
    @GetMapping("/geopolitical_hotspot")
    public ResponseEntity<ApiResponse<List<GeopoliticalHotspotResponse>>> getGeopoliticalHotspotWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<GeopoliticalHotspotResponse> data = graphAnalysisService.getGeopoliticalHotspotWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Identifies key figures who link recurring thematic phrases across the media graph, quantifying their frequency, average sentiment, and opinion stability")
    @GetMapping("/narrative_bridge")
    public ResponseEntity<ApiResponse<List<NarrativeBridgeResponse>>> getNarrativeBridgeWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<NarrativeBridgeResponse> data = graphAnalysisService.getNarrativeBridgeWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Breaks down the primary entity types and topics covered by individual media outlets using stacked column breakdowns.")
    @GetMapping("/publisher_focus")
    public ResponseEntity<ApiResponse<List<PublisherFocusResponse>>> getPublisherFocusWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<PublisherFocusResponse> data = graphAnalysisService.getPublisherFocusWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Generates interactive force-directed graph models to reveal key entities and their multi-hop relationships extracted from news content.\n")
    @GetMapping("/influencer_network")
    public ResponseEntity<ApiResponse<List<InfluencerNetworkResponse>>> getInfluencerNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<InfluencerNetworkResponse> data = graphAnalysisService.getInfluencerNetworkWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Plots exact entity locations and city-level coordinates as proportional bubble pins to highlight regional mention density.\n")
    @GetMapping("/spatial_map")
    public ResponseEntity<ApiResponse<List<SpatialMapResponse>>> getSpatialMapWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<SpatialMapResponse> data = graphAnalysisService.getSpatialMapWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Maps co-occurrence connections between institutional nodes (such as corporate alliances or state partnerships) as a bipartite graph.")
    @GetMapping("/alliance_network")
    public ResponseEntity<ApiResponse<List<AllianceNetworkResponse>>> getAllianceNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<AllianceNetworkResponse> data = graphAnalysisService.getAllianceNetworkWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Calculates publisher-level sentiment distribution on a diverging axis to evaluate partisan framing and editorial bias.\n")
    @GetMapping("/media_bias")
    public ResponseEntity<ApiResponse<List<MediaBiasResponse>>> getMediaBiasWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<MediaBiasResponse> data = graphAnalysisService.getMediaBiasWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary ="Filters high-severity, location-tagged incidents into a real-time risk leaderboard for threat monitoring.")
    @GetMapping("/crisis_and_risk_radar")
    public ResponseEntity<ApiResponse<List<CrisisAndRiskRadarResponse>>> getCrisisAndRiskRadarWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<CrisisAndRiskRadarResponse> data = graphAnalysisService.getCrisisAndRiskRadarWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Groups co-occurring phrases into hierarchical treemaps to illustrate underlying narrative themes within breaking news")
    @GetMapping("/trending_keyword_cluster")
    public ResponseEntity<ApiResponse<List<TrendingKeywordClusterResponse>>> getTrendingKeywordClusterWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<TrendingKeywordClusterResponse> data = graphAnalysisService.getTrendingKeywordClusterWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/graph_entities")
    public ResponseEntity<ApiResponse<GraphResponse>> getEntitiesGraphWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        GraphResponse data = graphAnalysisService.getEntitiesGraphWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Provides a macro-level treemap breakdown of dominant story themes driving high article volume across global feeds.\n")
    @GetMapping("/global_trends")
    public ResponseEntity<ApiResponse<GlobalTrendsResponse>> getGlobalTrendsWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount,
        @RequestParam String calendarInterval
    ){
        GlobalTrendsResponse data = indexAnalysisService.getGlobalTrendsWithRelativeInterval(intervalUnit, amount,calendarInterval).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Renders multi-stream timelines of top mentioned entities to observe shifting macro attention over time.\n")
    @GetMapping("/global_entity_trends")
    public ResponseEntity<ApiResponse<GlobalEntityTrendsResponse>> getGlobalEntityWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ){
        GlobalEntityTrendsResponse data = indexAnalysisService.getGlobalEntityWithRelativeInterval(intervalUnit,amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Delivers high-relevance full-text article search with exact term highlighting, BM25 scoring, and snippet generation.")
    @GetMapping("/impact_articles")
    public ResponseEntity<ApiResponse<List<InferenceNews>>> getImpactArticlesWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount, 
        @RequestParam int topN, 
        @RequestParam boolean isPositive
    ){
        List<InferenceNews> data = indexAnalysisService.getImpactArticlesWithRelativeInterval(intervalUnit,amount,topN,isPositive).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Plots relative coverage intensity across major sectors (e.g., Politics, Tech, Economy) to map macro media attention distribution.")
    @GetMapping("/top_radar")
    public ResponseEntity<ApiResponse<TopRadarResponse>> getTopicRadarWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        TopRadarResponse data = indexAnalysisService.getTopicRadarWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Generates an $N times N$ heatmap grid calculating mutual coverage density and joint sentiment between top political and corporate figures.")
    @GetMapping("/co_occurrence_cell")
    public ResponseEntity<ApiResponse<List<CoOccurrenceCellResponse>>> getEntityCoOccurrenceMatrixWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<CoOccurrenceCellResponse> data = graphAnalysisService.getEntityCoOccurrenceMatrixWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));

    }

    @Operation(summary = "Measures the standard deviation of entity sentiment scores to identify controversial figures generating conflicting, polar-opposite coverage.\n")
    @GetMapping("/entity_polarization")
    public ResponseEntity<ApiResponse<List<EntityPolarizationResponse>>> getEntityPolarizationWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EntityPolarizationResponse> data = graphAnalysisService.getEntityPolarizationWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Clusters articles by content hashes to trace syndicated press releases, copy-pasted content, and narrative propagation across publishers.\n")
    @GetMapping("/echo_chamber")
    public ResponseEntity<ApiResponse<List<EchoChamberResponse>>> getEchoChamberWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EchoChamberResponse> data = indexAnalysisService.getEchoChamberWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Compares coverage across consecutive time windows to highlight fast-rising breakout entities rather than static, established entities.\n")
    @GetMapping("/entity_velocity")
    public ResponseEntity<ApiResponse<List<EntityVelocityResponse>>> getEntityVelocityWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EntityVelocityResponse> data = indexAnalysisService.getEntityVelocityWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Quantifies total coverage volume against unique narrative clusters to measure media amplification, while mapping the dominant locations and entities shaping the news landscape.")
    @GetMapping("/media_pulse_overview")
    public ResponseEntity<ApiResponse<MediaPulseOverviewResponse>> getMediaPulseOverviewWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        MediaPulseOverviewResponse data = indexAnalysisService.getMediaPulseOverviewWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Detects statistically anomalous buzzwords spiking in real time compared to historical baselines to uncover sudden emerging topics.")
    @GetMapping("/significant_terms_aggregation")
    public ResponseEntity<ApiResponse<List<SignificantTermsAggregationResponse>>> getSignificantTermsAggregationWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<SignificantTermsAggregationResponse> data = indexAnalysisService.getSignificantTermsAggregationWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Tracks article publication volume alongside sentiment shifts over time to visualize how media coverage scales during breaking news.")
    @GetMapping("/sentiment_volume_timeline")
    public ResponseEntity<ApiResponse<SentimentVolumeTimelineResponse>> getSentimentVolumeTimelineWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam String calendarInterval
    ){
        SentimentVolumeTimelineResponse data = indexAnalysisService.getSentimentVolumeTimelineWithRelativeInterval(intervalUnit, amount, calendarInterval).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
