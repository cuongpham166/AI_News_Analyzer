package com.example.news.api.controller;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.response.news.NewsSearchResponse;
import com.example.news.api.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/news")
    public ResponseEntity<ApiResponse<List<NewsSearchResponse>>> searchNews(
            String searchText,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "5") int size
    ) throws IOException {
        List<NewsSearchResponse> data = searchService.searchNews(searchText, page, size);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/entities")
    public ResponseEntity<ApiResponse<List<NewsSearchResponse>>> searchEntities(
            String searchText,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "5") int size
    ) throws IOException {
        List<NewsSearchResponse> data = searchService.searchEntities(searchText, page, size);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/source")
    public ResponseEntity<ApiResponse<List<NewsSearchResponse>>> searchSource(
            String searchText,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "5") int size
    ) throws IOException {
        List<NewsSearchResponse> data = searchService.searchSource(searchText, page, size);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<NewsSearchResponse>>> searchEverything(
            String searchText,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "5") int size
    ) throws IOException {
        List<NewsSearchResponse> data = searchService.searchEverything(searchText, page, size);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /*
        Everything
        News
        Sources
        Entities
    */
}
