package com.example.news.api.controller;
import java.io.IOException;
import java.util.List;

import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.news.api.service.AnalysisService;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {
    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService ) {
        this.analysisService = analysisService;
    }

    @GetMapping("/public")
    public String publicApi() {
        return "Public";
    }

    @GetMapping("/private")
    public String privateApi(Authentication authentication) {
        return "Hello " + authentication.getName();
    }

    @GetMapping("/global_trends")
    public GlobalTrendsResponse getGlobalTrendsWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ) throws IOException {
        return this.analysisService.getGlobalTrendsWithRelativeInterval(intervalUnit,amount);
    }

    @GetMapping("/global_entity_trends")
    public GlobalEntityTrendsResponse getGlobalEntityWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    )throws IOException {
        return this.analysisService.getGlobalEntityWithRelativeInterval(intervalUnit,amount);
    }

    @GetMapping("/impact_articles")
    public List<InferenceNews> getImpactArticlesWithRelativeInterval(
        @RequestParam String intervalUnit, 
        @RequestParam int amount, 
        @RequestParam int topN, 
        @RequestParam boolean isPositive
    ) throws IOException{
        return this.analysisService.getImpactArticlesWithRelativeInterval(intervalUnit,amount,topN,isPositive);
    }

    @GetMapping("/spatial_map")
    public List<SpatialMapResponse> getSpatialMapWithRelativeInterval (
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ){
        return this.analysisService.getSpatialMapWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/power_couple")
    public List<PowerCoupleResponse> getPowerCoupleWithRelativeInterval (
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ){
        return this.analysisService.getPowerCoupleWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/event_tracker")
    public List<EventTrackerResponse> getEventTrackerWithRelativeInterval (
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ){
        return this.analysisService.getEventTrackerWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/volatility_index")
    public List<VolatilityIndexResponse> getVolatilityIndexWithRelativeInterval (
        @RequestParam String intervalUnit, 
        @RequestParam int amount
    ){
        return this.analysisService.getVolatilityIndexWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/top_radar")
    public TopRadarResponse getTopicRadarWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ) throws IOException{
        return this.analysisService.getTopicRadarWithRelativeInterval(intervalUnit, amount);
    }

    @GetMapping("/discovery")
    public GraphResponse getDiscoveryDataWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        return this.analysisService.getDiscoveryDataWithRelativeInterval(intervalUnit, amount);
    }

}
