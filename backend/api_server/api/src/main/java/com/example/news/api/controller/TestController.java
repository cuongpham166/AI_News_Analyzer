package com.example.news.api.controller;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.response.analysis.index.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
import com.example.news.api.service.analysis.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    private final AnalyticsService analyticsService;

    public TestController (AnalyticsService analyticsService){
        this.analyticsService = analyticsService;
    }

    @GetMapping("/clickhouse/global-trend")
    public ResponseEntity<ApiResponse<GlobalTrendsResponse>> getAnalyticsGlobalTrendsWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam String calendarInterval
    ){
        GlobalTrendsResponse data = analyticsService.getAnalyticsGlobalTrendsWithRelativeInterval(intervalUnit, amount,calendarInterval);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/clickhouse/global-entites-trend")
    public ResponseEntity<ApiResponse<GlobalEntityTrendsResponse>> getAnalyticsGlobalEntitesTrendsWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam String calendarInterval
    ){
        GlobalEntityTrendsResponse data = analyticsService.getAnalyticsGlobalEntitiesTrendsWithRelativeInterval(intervalUnit, amount,calendarInterval);
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
