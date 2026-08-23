package com.example.news.api.controller.analysis;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.MediaBiasResponse;
import com.example.news.api.dto.response.analysis.graph.SourceCoverageResponse;
import com.example.news.api.dto.response.analysis.graph.PublisherFocusResponse;
import com.example.news.api.dto.response.analysis.graph.TrendingKeywordClusterResponse;
import com.example.news.api.dto.response.analysis.index.EchoChamberResponse;
import com.example.news.api.service.analysis.DashboardAnalysisService;
import com.example.news.api.service.analysis.GraphAnalysisService;
import com.example.news.api.service.analysis.IndexAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analysis/media-bias")
public class MediaBiasController {
    private final GraphAnalysisService graphAnalysisService;
    private final IndexAnalysisService indexAnalysisService;
    private final DashboardAnalysisService dashboardAnalysisService;

    public MediaBiasController(
            GraphAnalysisService graphAnalysisService,
            IndexAnalysisService indexAnalysisService,
            DashboardAnalysisService dashboardAnalysisService
    ){
        this.graphAnalysisService = graphAnalysisService;
        this.indexAnalysisService = indexAnalysisService;
        this.dashboardAnalysisService = dashboardAnalysisService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<MediaBiasResponse>> getMediaBiasDashboard (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        MediaBiasResponse data = dashboardAnalysisService.getMediaBiasDashboard(intervalUnit, amount);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Calculates publisher-level sentiment distribution on a diverging axis to evaluate partisan framing and editorial bias.")
    @GetMapping("/source-coverage")
    public ResponseEntity<ApiResponse<List<SourceCoverageResponse>>> getSourceCoverageWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<SourceCoverageResponse> data = graphAnalysisService.getMediaBiasWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Breaks down the primary entity types and topics covered by individual media outlets using stacked column breakdowns.")
    @GetMapping("/publisher-focus")
    public ResponseEntity<ApiResponse<List<PublisherFocusResponse>>> getPublisherFocusWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<PublisherFocusResponse> data = graphAnalysisService.getPublisherFocusWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Clusters articles by content hashes to trace syndicated press releases, copy-pasted content, and narrative propagation across publishers.\n")
    @GetMapping("/echo-chamber")
    public ResponseEntity<ApiResponse<List<EchoChamberResponse>>> getEchoChamberWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<EchoChamberResponse> data = indexAnalysisService.getEchoChamberWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }


    @Operation(summary = "Groups co-occurring phrases into hierarchical treemap to illustrate underlying narrative themes within breaking news")
    @GetMapping("/trending-keyword-cluster")
    public ResponseEntity<ApiResponse<List<TrendingKeywordClusterResponse>>> getTrendingKeywordClusterWithRelativeInterval (
            @RequestParam String intervalUnit,
            @RequestParam int amount
    ){
        List<TrendingKeywordClusterResponse> data = graphAnalysisService.getTrendingKeywordClusterWithRelativeInterval(intervalUnit, amount).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @Operation(summary = "Delivers high-relevance full-text article search with exact term highlighting, BM25 scoring, and snippet generation.")
    @GetMapping("/impact-articles")
    public ResponseEntity<ApiResponse<List<InferenceNews>>> getImpactArticlesWithRelativeInterval(
            @RequestParam String intervalUnit,
            @RequestParam int amount,
            @RequestParam int topN,
            @RequestParam boolean isPositive
    ){
        List<InferenceNews> data = indexAnalysisService.getImpactArticlesWithRelativeInterval(intervalUnit,amount,topN,isPositive).join();
        return ResponseEntity.ok(ApiResponse.success(data));
    }
}
