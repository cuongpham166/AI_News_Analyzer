package com.example.news.api.controller.analysis;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.response.analysis.GraphResponse;
import com.example.news.api.dto.response.analysis.NetworkLabResponse;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.service.analysis.DashboardAnalysisService;
import com.example.news.api.service.analysis.GraphAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analysis/network-lab")
public class NetworkLabController {
    private final GraphAnalysisService graphAnalysisService;
    private final DashboardAnalysisService dashboardAnalysisService;

    public NetworkLabController(
            GraphAnalysisService graphAnalysisService,
            DashboardAnalysisService dashboardAnalysisService
    ){
        this.graphAnalysisService = graphAnalysisService;
        this.dashboardAnalysisService = dashboardAnalysisService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<NetworkLabResponse>> getNetworkLabDashboard (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        NetworkLabResponse data = dashboardAnalysisService.getNetworkLabDashboard(intervalUnit, amount);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Maps co-occurrence connections between institutional nodes (such as corporate alliances or state partnerships) as a bipartite graph.")
    @GetMapping("/alliance-network")
    public ResponseEntity<ApiResponse<List<AllianceNetworkResponse>>> getAllianceNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<AllianceNetworkResponse> data = graphAnalysisService.getAllianceNetworkWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Visualizes strong directional entity pairings and connection pathways using flow-based Sankey diagrams.")
    @GetMapping("/power-couple")
    public ResponseEntity<ApiResponse<List<PowerCouplesResponse>>> getPowerCoupleWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<PowerCouplesResponse> data = graphAnalysisService.getPowerCoupleWithRelativeInterval(intervalUnit,amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Generates an $N times N$ heatmap grid calculating mutual coverage density and joint sentiment between top political and corporate figures.")
    @GetMapping("/co-occurrence-cell")
    public ResponseEntity<ApiResponse<List<CoOccurrenceCellResponse>>> getEntityCoOccurrenceMatrixWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<CoOccurrenceCellResponse> data = graphAnalysisService.getEntityCoOccurrenceMatrixWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));

    }

    @Operation(summary = "Measures the standard deviation of entity sentiment scores to identify controversial figures generating conflicting, polar-opposite coverage.\n")
    @GetMapping("/entity-polarization")
    public ResponseEntity<ApiResponse<List<EntityPolarizationResponse>>> getEntityPolarizationWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EntityPolarizationResponse> data = graphAnalysisService.getEntityPolarizationWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Generates interactive force-directed graph models to reveal key entities and their multi-hop relationships extracted from news content.\n")
    @GetMapping("/influencer-network")
    public ResponseEntity<ApiResponse<List<InfluencerNetworkResponse>>> getInfluencerNetworkWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<InfluencerNetworkResponse> data = graphAnalysisService.getInfluencerNetworkWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /*Old api*/
    @GetMapping("/graph-entities")
    public ResponseEntity<ApiResponse<GraphResponse>> getEntitiesGraphWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        GraphResponse data = graphAnalysisService.getEntitiesGraphWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Identifies key figures who link recurring thematic phrases across the media graph, quantifying their frequency, average sentiment, and opinion stability")
    @GetMapping("/narrative-bridge")
    public ResponseEntity<ApiResponse<List<NarrativeBridgeResponse>>> getNarrativeBridgeWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<NarrativeBridgeResponse> data = graphAnalysisService.getNarrativeBridgeWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("event-risk-radar")
    public ResponseEntity<ApiResponse<List<EventRiskRadarResponse>>> getEventRiskRadarWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EventRiskRadarResponse> data = graphAnalysisService.getEventRiskRadarWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("event-momentum")
    public ResponseEntity<ApiResponse<List<EventMomentumResponse>>> getEventMomentumWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EventMomentumResponse> data = graphAnalysisService.getEventMomentumWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }



}
