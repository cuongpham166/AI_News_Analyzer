package com.example.news.api.controller;
import java.io.IOException;
import java.util.List;

import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.*;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.service.analysis.GraphAnalysisService;
import com.example.news.api.service.analysis.IndexAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    private final GraphAnalysisService graphAnalysisService;
    private final IndexAnalysisService indexAnalysisService;

    public AnalysisController(
            GraphAnalysisService graphAnalysisService,
            IndexAnalysisService indexAnalysisService
    ) {
        this.graphAnalysisService = graphAnalysisService;
        this.indexAnalysisService = indexAnalysisService;
    }

    @Operation(summary = "Visualizes strong directional entity pairings and connection pathways using flow-based Sankey diagrams.")
    @GetMapping("/power_couple")
    public List<PowerCouplesResponse> getPowerCoupleWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getPowerCoupleWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Organizes news events chronologically along a vertical map timeline to reconstruct key incident progressions.\n")
    @GetMapping("/event_tracker")
    public List<EventTrackerResponse> getEventTrackerWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getEventTrackerWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Renders a country-level choropleth map that highlights regional risk, conflict exposure, and country-specific coverage volume.\n")
    @GetMapping("/geopolitical_hotspot")
    public List<GeopoliticalHotspotResponse> getGeopoliticalHotspotWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getGeopoliticalHotspotWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Identifies key figures who link recurring thematic phrases across the media graph, quantifying their frequency, average sentiment, and opinion stability")
    @GetMapping("/narrative_bridge")
    public List<NarrativeBridgeResponse> getNarrativeBridgeWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getNarrativeBridgeWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Breaks down the primary entity types and topics covered by individual media outlets using stacked column breakdowns.")
    @GetMapping("/publisher_focus")
    public List<PublisherFocusResponse> getPublisherFocusWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getPublisherFocusWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Generates interactive force-directed graph models to reveal key entities and their multi-hop relationships extracted from news content.\n")
    @GetMapping("/influencer_network")
    public List<InfluencerNetworkResponse> getInfluencerNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getInfluencerNetworkWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Plots exact entity locations and city-level coordinates as proportional bubble pins to highlight regional mention density.\n")
    @GetMapping("/spatial_map")
    public List<SpatialMapResponse> getSpatialMapWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getSpatialMapWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Maps co-occurrence connections between institutional nodes (such as corporate alliances or state partnerships) as a bipartite graph.")
    @GetMapping("/alliance_network")
    public List<AllianceNetworkResponse> getAllianceNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getAllianceNetworkWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Calculates publisher-level sentiment distribution on a diverging axis to evaluate partisan framing and editorial bias.\n")
    @GetMapping("/media_bias")
    public List<MediaBiasResponse> getMediaBiasWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getMediaBiasWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary ="Filters high-severity, location-tagged incidents into a real-time risk leaderboard for threat monitoring.")
    @GetMapping("/crisis_and_risk_radar")
    public List<CrisisAndRiskRadarResponse> getCrisisAndRiskRadarWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getCrisisAndRiskRadarWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Groups co-occurring phrases into hierarchical treemaps to illustrate underlying narrative themes within breaking news")
    @GetMapping("/trending_keyword_cluster")
    public List<TrendingKeywordClusterResponse> getTrendingKeywordClusterWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getTrendingKeywordClusterWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/graph_entities")
    public GraphResponse getEntitiesGraphWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getEntitiesGraphWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Provides a macro-level treemap breakdown of dominant story themes driving high article volume across global feeds.\n")
    @GetMapping("/global_trends")
    public GlobalTrendsResponse getGlobalTrendsWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ) throws IOException {
        return this.indexAnalysisService.getGlobalTrendsWithRelativeInterval(intervalUnit,amount);
    }

    @Operation(summary = "Renders multi-stream timelines of top mentioned entities to observe shifting macro attention over time.\n")
    @GetMapping("/global_entity_trends")
    public GlobalEntityTrendsResponse getGlobalEntityWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    )throws IOException {
        return this.indexAnalysisService.getGlobalEntityWithRelativeInterval(intervalUnit,amount);
    }

    @Operation(summary = "Delivers high-relevance full-text article search with exact term highlighting, BM25 scoring, and snippet generation.")
    @GetMapping("/impact_articles")
    public List<InferenceNews> getImpactArticlesWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount, 
        @RequestParam int topN, 
        @RequestParam boolean isPositive
    ) throws IOException{
        return this.indexAnalysisService.getImpactArticlesWithRelativeInterval(intervalUnit,amount,topN,isPositive);
    }

    @Operation(summary = "Plots relative coverage intensity across major sectors (e.g., Politics, Tech, Economy) to map macro media attention distribution.")
    @GetMapping("/top_radar")
    public TopRadarResponse getTopicRadarWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ) throws IOException{
        return this.indexAnalysisService.getTopicRadarWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Generates an $N \\times N$ heatmap grid calculating mutual coverage density and joint sentiment between top political and corporate figures.")
    @GetMapping("/co_occurrence_cell")
    public List<CoOccurrenceCellResponse> getEntityCoOccurrenceMatrixWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getEntityCoOccurrenceMatrixWithRelativeInterval(intervalUnit, amount);
    }


    @Operation(summary = "Measures the standard deviation of entity sentiment scores to identify controversial figures generating conflicting, polar-opposite coverage.\n")
    @GetMapping("/entity_polarization")
    public List<EntityPolarizationResponse> getEntityPolarizationWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getEntityPolarizationWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Clusters articles by content hashes to trace syndicated press releases, copy-pasted content, and narrative propagation across publishers.\n")
    @GetMapping("/echo_chamber")
    public List<EchoChamberResponse> getEchoChamberWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ) throws IOException {
        return this.indexAnalysisService.getEchoChamberWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Compares coverage across consecutive time windows to highlight fast-rising breakout entities rather than static, established entities.\n")
    @GetMapping("/entity_velocity")
    public List<EntityVelocityResponse> getEntityVelocityWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ) throws IOException {
        return this.indexAnalysisService.getEntityVelocityWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Quantifies total coverage volume against unique narrative clusters to measure media amplification, while mapping the dominant locations and entities shaping the news landscape.")
    @GetMapping("/media_pulse_overview")
    public MediaPulseOverviewResponse getMediaPulseOverviewWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ) throws IOException {
        return this.indexAnalysisService.getMediaPulseOverviewWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Detects statistically anomalous buzzwords spiking in real time compared to historical baselines to uncover sudden emerging topics.")
    @GetMapping("/significant_terms_aggregation")
    public List<SignificantTermsAggregationResponse> getSignificantTermsAggregationWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ) throws IOException {
        return this.indexAnalysisService.getSignificantTermsAggregationWithRelativeInterval(intervalUnit, amount);
    }

    @Operation(summary = "Tracks article publication volume alongside sentiment shifts over time to visualize how media coverage scales during breaking news.")
    @GetMapping("/sentiment_volume_timeline")
    public SentimentVolumeTimelineResponse getSentimentVolumeTimelineWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam String calendarInterval
    ) throws IOException {
        return this.indexAnalysisService.getSentimentVolumeTimelineWithRelativeInterval(intervalUnit, amount, calendarInterval);
    }

}
