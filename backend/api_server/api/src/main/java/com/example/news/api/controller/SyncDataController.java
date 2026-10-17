package com.example.news.api.controller;

import com.example.news.api.service.LocationService;
import com.example.news.api.service.SyncDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sync")
public class SyncDataController {
    private final LocationService locationService;
    private final SyncDataService syncDataService;

    public SyncDataController(
            LocationService locationService,
            SyncDataService syncDataService
    ){
        this.locationService = locationService;
        this.syncDataService = syncDataService;
    }


    @GetMapping("/location-postgres-to-neo4j")
    public ResponseEntity<String> syncCoordinationDataFromPostgresToNeo4j(){
        locationService.syncCoordinationDataFromPostgresToNeo4j();
        return ResponseEntity.accepted()
                .body("Location synchronization started.");
    }

    @GetMapping("/sync-locations-with-zero-coordinates-in-postgresql")
    public ResponseEntity<String> syncLocationsWithZeroCoordinates(){
        locationService.syncLocationsWithZeroCoordinates();
        return ResponseEntity.accepted()
                .body("Location synchronization started.");
    }

    @GetMapping("/postgre-to-clickhouse")
    public ResponseEntity<String> syncPostgresToClickhouse(){
        syncDataService.syncPostgresToClickhouse();
        return ResponseEntity.accepted()
                .body("PostgresToClickhouse synchronization started.");
    }
}
