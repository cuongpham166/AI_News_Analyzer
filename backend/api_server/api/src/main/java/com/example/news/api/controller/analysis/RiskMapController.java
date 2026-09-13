package com.example.news.api.controller.analysis;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.response.analysis.RiskMapResponse;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.service.analysis.DashboardService;
import com.example.news.api.service.analysis.GraphService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analysis/risk-map")
public class RiskMapController {
    private final GraphService graphService;
    private final DashboardService dashboardService;

    public RiskMapController(
            GraphService graphService,
            DashboardService dashboardService
    ){
        this.graphService = graphService;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<RiskMapResponse>>getRiskMapDashboard(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        RiskMapResponse data = dashboardService.getRiskMapDashboard(intervalUnit, amount);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Renders a country-level choropleth map that highlights regional risk, conflict exposure, and country-specific coverage volume.\n")
    @GetMapping("/geopolitical_hotspot")
    public ResponseEntity<ApiResponse<List<GeopoliticalHotspotResponse>>> getGeopoliticalHotspotWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<GeopoliticalHotspotResponse> data = graphService.getGeopoliticalHotspotWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/geopolitical_metrics")
    public ResponseEntity<ApiResponse<GeopoliticalMetricsResponse>> getGeopoliticalMetricsWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        GeopoliticalMetricsResponse data = graphService.getGeopoliticalMetricsWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/country_risk")
    public ResponseEntity<ApiResponse<List<CountryRiskResponse>>> getCountryRiskWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<CountryRiskResponse> data = graphService.getCountryRiskWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }


    @Operation(summary = "Plots exact entity locations and city-level coordinates as proportional bubble pins to highlight regional mention density.\n")
    @GetMapping("/spatial_map")
    public ResponseEntity<ApiResponse<List<SpatialMapResponse>>> getSpatialMapWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<SpatialMapResponse> data = graphService.getSpatialMapWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Organizes news events chronologically along a vertical map timeline to reconstruct key incident progressions.\n")
    @GetMapping("/event_tracker")
    public ResponseEntity<ApiResponse<List<EventTrackerResponse>>> getEventTrackerWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EventTrackerResponse> data = graphService.getEventTrackerWithRelativeInterval(intervalUnit,amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/event-tracker-metrics")
    public ResponseEntity<ApiResponse<EventTrackerMetricsResponse>> getEventTrackerMetricsWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        EventTrackerMetricsResponse data = graphService.getEventTrackerMetricsWithRelativeInterval(intervalUnit,amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary ="Filters high-severity, location-tagged incidents into a real-time risk leaderboard for threat monitoring.")
    @GetMapping("/crisis_and_risk_radar")
    public ResponseEntity<ApiResponse<List<CrisisAndRiskRadarResponse>>> getCrisisAndRiskRadarWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<CrisisAndRiskRadarResponse> data = graphService.getCrisisAndRiskRadarWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
