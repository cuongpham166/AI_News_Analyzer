package com.example.news.api.controller.analysis;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.response.analysis.MacroPulseDetailResponse;
import com.example.news.api.dto.response.analysis.MacroPulseOverviewResponse;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.dto.response.analysis.jpa.MetaDataDistributionResponse;
import com.example.news.api.service.analysis.DashboardService;
import com.example.news.api.service.analysis.IndexService;
import com.example.news.api.service.analysis.JpaService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analysis/macro-pulse")
public class MacroPulseController {
    private final IndexService indexService;
    private final JpaService jpaService;
    private final DashboardService dashboardService;
    public MacroPulseController (
            IndexService indexService,
            JpaService jpaService,
            DashboardService dashboardService
    ){
        this.indexService = indexService;
        this.jpaService = jpaService;
        this.dashboardService = dashboardService;
    }


    @GetMapping("/dashboard/overview")
    public ResponseEntity<ApiResponse<MacroPulseOverviewResponse>> getMacroPulseOverviewDashboard(
    ){
        MacroPulseOverviewResponse data = dashboardService.getMacroPulseOverviewDashboard();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/dashboard/detail")
    public ResponseEntity<ApiResponse<MacroPulseDetailResponse>> getMacroPulseDetailDashboard
            (@RequestParam String intervalUnit,@RequestParam int amount,@RequestParam String calendarInterval)
    {
        MacroPulseDetailResponse data = dashboardService.getMacroPulseDetailDashboard(intervalUnit,amount,calendarInterval);
        return ResponseEntity.ok(ApiResponse.success(data));
    }


    @GetMapping("/metadata")
    public ResponseEntity<ApiResponse<MetaDataDistributionResponse>> getMetaDataDistribution(){
        MetaDataDistributionResponse data = jpaService.getMetaDataDistribution();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Quantifies total coverage volume against unique narrative clusters to measure media amplification, while mapping the dominant locations and entities shaping the news landscape.")
    @GetMapping("/media-pulse-overview")
    public ResponseEntity<ApiResponse<MediaPulseOverviewResponse>> getMediaPulseOverviewWithRelativeInterval (
    ){
        MediaPulseOverviewResponse data = indexService.getMediaPulseOverviewWithRelativeInterval().join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Provides a macro-level treemap breakdown of dominant story themes driving high article volume across global feeds.\n")
    @GetMapping("/global-trends")
    public ResponseEntity<ApiResponse<GlobalTrendsResponse>> getGlobalTrendsWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam String calendarInterval
    ){
        GlobalTrendsResponse data = indexService.getGlobalTrendsWithRelativeInterval(intervalUnit, amount,calendarInterval).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Renders multi-stream timelines of top mentioned entities to observe shifting macro attention over time.\n")
    @GetMapping("/global-entity-trends")
    public ResponseEntity<ApiResponse<GlobalEntityTrendsResponse>> getGlobalEntityWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam String calendarInterval
    ){
        GlobalEntityTrendsResponse data = indexService.getGlobalEntityWithRelativeInterval(intervalUnit,amount,calendarInterval).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Compares coverage across consecutive time windows to highlight fast-rising breakout entities rather than static, established entities.\n")
    @GetMapping("/entity-velocity")
    public ResponseEntity<ApiResponse<List<EntityVelocityResponse>>> getEntityVelocityWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EntityVelocityResponse> data = indexService.getEntityVelocityWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Detects statistically anomalous buzzwords spiking in real time compared to historical baselines to uncover sudden emerging topics.")
    @GetMapping("/significant-terms-aggregation")
    public ResponseEntity<ApiResponse<List<SignificantTermsAggregationResponse>>> getSignificantTermsAggregationWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<SignificantTermsAggregationResponse> data = indexService.getSignificantTermsAggregationWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Plots relative coverage intensity across major sectors (e.g., Politics, Tech, Economy) to map macro media attention distribution.")
    @GetMapping("/topic-radar")
    public ResponseEntity<ApiResponse<TopRadarResponse>> getTopicRadarWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        TopRadarResponse data = indexService.getTopicRadarWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Tracks article publication volume alongside sentiment shifts over time to visualize how media coverage scales during breaking news.")
    @GetMapping("/sentiment-volume-timeline")
    public ResponseEntity<ApiResponse<SentimentVolumeTimelineResponse>> getSentimentVolumeTimelineWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam String calendarInterval
    ){
        SentimentVolumeTimelineResponse data = indexService.getSentimentVolumeTimelineWithRelativeInterval(intervalUnit, amount, calendarInterval).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
