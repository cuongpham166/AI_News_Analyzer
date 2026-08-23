package com.example.news.api.controller;
import java.io.IOException;
import java.util.List;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.*;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.dto.response.analysis.jpa.MetaDataDistributionResponse;
import com.example.news.api.service.LocationService;
import com.example.news.api.service.analysis.GraphAnalysisService;
import com.example.news.api.service.analysis.IndexAnalysisService;
import com.example.news.api.service.analysis.JpaAnalysisService;
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
    private final JpaAnalysisService jpaAnalysisService;

    public AnalysisController(
            GraphAnalysisService graphAnalysisService,
            IndexAnalysisService indexAnalysisService,
            LocationService locationService,
            JpaAnalysisService jpaAnalysisService
    ) {
        this.graphAnalysisService = graphAnalysisService;
        this.indexAnalysisService = indexAnalysisService;
        this.locationService = locationService;
        this.jpaAnalysisService = jpaAnalysisService;
    }






    @GetMapping("sync_location")
    public ResponseEntity<String> syncLocationCoordinatesEntity(){
        //locationService.syncLocationCoordinatesEntity();
        locationService.syncCoordinationDataFromPostgres();
        return ResponseEntity.accepted()
                .body("Location synchronization started.");
    }
}
