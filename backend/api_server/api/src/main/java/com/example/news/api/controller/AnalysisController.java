package com.example.news.api.controller;
import java.io.IOException;
import java.util.List;

import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.*;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.dto.response.analysis.index.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
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

    @Operation(summary = "Check Public")
    @GetMapping("/public")
    public String publicApi() {
        return "Public";
    }


    /*@GetMapping("/private")
    public String privateApi(Authentication authentication) {
        return "Hello " + authentication.getName();
    }*/

    @GetMapping("/power_couple")
    public List<PowerCouplesResponse> getPowerCoupleWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getPowerCoupleWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/event_tracker")
    public List<EventTrackerResponse> getEventTrackerWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getEventTrackerWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/geopolitical_hotspot")
    public List<GeopoliticalHotspotResponse> getGeopoliticalHotspotWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getGeopoliticalHotspotWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/narrative_bridge")
    public List<NarrativeBridgeResponse> getNarrativeBridgeWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getNarrativeBridgeWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/publisher_focus")
    public List<PublisherFocusResponse> getPublisherFocusWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getPublisherFocusWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/influencer_network")
    public List<InfluencerNetworkResponse> getInfluencerNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getInfluencerNetworkWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/spatial_map")
    public List<SpatialMapResponse> getSpatialMapWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getSpatialMapWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/alliance_network")
    public List<AllianceNetworkResponse> getAllianceNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getAllianceNetworkWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/media_bias")
    public List<MediaBiasResponse> getMediaBiasWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getMediaBiasWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/crisis_and_risk_radar")
    public List<CrisisAndRiskRadarResponse> getCrisisAndRiskRadarWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.graphAnalysisService.getCrisisAndRiskRadarWithRelativeInterval(intervalUnit, amount);
    }

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

    @GetMapping("/global_trends")
    public GlobalTrendsResponse getGlobalTrendsWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ) throws IOException {
        return this.indexAnalysisService.getGlobalTrendsWithRelativeInterval(intervalUnit,amount);
    }

    @GetMapping("/global_entity_trends")
    public GlobalEntityTrendsResponse getGlobalEntityWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    )throws IOException {
        return this.indexAnalysisService.getGlobalEntityWithRelativeInterval(intervalUnit,amount);
    }

    @GetMapping("/impact_articles")
    public List<InferenceNews> getImpactArticlesWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount, 
        @RequestParam int topN, 
        @RequestParam boolean isPositive
    ) throws IOException{
        return this.indexAnalysisService.getImpactArticlesWithRelativeInterval(intervalUnit,amount,topN,isPositive);
    }

    @GetMapping("/top_radar")
    public TopRadarResponse getTopicRadarWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ) throws IOException{
        return this.indexAnalysisService.getTopicRadarWithRelativeInterval(intervalUnit, amount);
    }
}
