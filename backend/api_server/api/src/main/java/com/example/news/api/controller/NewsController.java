package com.example.news.api.controller;

import java.util.List;

import com.example.news.api.dto.response.news.DetailedNewsResponse;
import org.springframework.web.bind.annotation.*;


import com.example.news.api.service.MetaDataService;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final MetaDataService metadataService;
    public NewsController(MetaDataService metadataService) {
        this.metadataService = metadataService;
    }

    @GetMapping("/all")
    public List<com.example.news.api.dto.response.news.DetailedNewsResponse> getAllNews(@RequestParam(required = false, defaultValue = "10") int limit) {
        return this.metadataService.getAllNews(limit);
    }

    @GetMapping("/all/source")
    public List<com.example.news.api.dto.response.news.DetailedNewsResponse> getAllNewsBySourceId(@RequestParam int sourceId) {
        return this.metadataService.getAllNewsBySourceId(sourceId);
    }

    @GetMapping("/detail")
    public DetailedNewsResponse getNewsByLink(@RequestParam String link) {
        return this.metadataService.getDetailedNewsByLink(link);
    }

}