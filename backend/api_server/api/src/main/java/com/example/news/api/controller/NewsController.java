package com.example.news.api.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import com.example.news.api.dto.internal.ApiResponse;
import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.dto.response.news.NewsResponse;
import com.example.news.api.dto.response.news.RecommendedNewsResponse;
import com.example.news.api.dto.response.news.SimilarNewsResponse;
import com.example.news.api.entity.NewsReactionEntity;
import com.example.news.api.service.news.*;
import com.example.news.api.service.user.UserInteractionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService newsService;
    private final UserInteractionService userInteractionService;
    private final RecommendedNewsService recommendedNewsService;
    private final SimilarNewsService similarNewsService;
    public NewsController(
            NewsService newsService,
            RecommendedNewsService recommendedNewsService,
            UserInteractionService userInteractionService,
            SimilarNewsService similarNewsService
    ) {
        this.newsService = newsService;
        this.recommendedNewsService = recommendedNewsService;
        this.userInteractionService = userInteractionService;
        this.similarNewsService = similarNewsService;
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getAllNews(@RequestParam(required = false, defaultValue = "10") int limit) {
        List<NewsResponse> data = newsService.getAllNews(limit);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/keyphrase")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getNewsByKeyphrase(@RequestParam String keyphrase) {
        List<NewsResponse> data = newsService.getNewsByKeyphrase(keyphrase);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/event")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getNewsByEvent(@RequestParam String event) {
        List<NewsResponse> data = newsService.getNewsByEvent(event);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/location")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getNewsByLocation(@RequestParam String location) {
        List<NewsResponse> data = newsService.getNewsByLocation(location);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/organization")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getNewsByOrganization(@RequestParam String organization) {
        List<NewsResponse> data = newsService.getNewsByOrganization(organization);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/person")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getNewsByPerson(@RequestParam String person) {
        List<NewsResponse> data = newsService.getNewsByPerson(person);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/source")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getNewsBySource(@RequestParam String source) {
        List<NewsResponse> data = newsService.getNewsBySource(source);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/topic")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> getNewsByTopic(@RequestParam String topic) {
        List<NewsResponse> data = newsService.getNewsByTopic(topic);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @GetMapping("/detail")
    public ResponseEntity<ApiResponse<DetailedNewsResponse>> getDetailNews(
            @RequestParam(required = false) UUID id,
            @RequestParam(required = false) String contentHash
    ) {
        DetailedNewsResponse data;

        if (id != null) {
            data = newsService.getDetailedNews(id);
        } else if (contentHash != null && !contentHash.isBlank()) {
            data = newsService.getDetailedNewsByContentHash(contentHash);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Either id or contentHash must be provided"
            );
        }

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/{newsId}/bookmark")
    public void addBookmark(@PathVariable UUID newsId, JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        userInteractionService.addJpaBookmark(newsId,userId);
    }

    @DeleteMapping("/{newsId}/bookmark")
    public void removeBookmark(@PathVariable UUID newsId, JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        userInteractionService.removeJpaBookmark(newsId,userId);
    }

    @PostMapping("/{newsId}/reaction")
    public void postReaction(@PathVariable UUID newsId, @PathVariable ReactionType reactionType, JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();

        Optional<NewsReactionEntity> existingReaction = userInteractionService.findNewsReaction(newsId,userId);

        if (existingReaction.isPresent()) {
            ReactionType savedType = existingReaction.get().getType();
            if (savedType == reactionType) {
                userInteractionService.removeJpaReaction(existingReaction.get());
            }else{
                userInteractionService.addJpaReaction(newsId,userId,reactionType);
            }
        }else{
            userInteractionService.addJpaReaction(newsId,userId,reactionType);
        }
    }

    @GetMapping("/personalized")
    public List<RecommendedNewsResponse> getPersonalizedFeed(JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        return recommendedNewsService.getPersonalizedFeed(userId,10);
    }

    @GetMapping("/similar")
    public ResponseEntity<ApiResponse<List<SimilarNewsResponse>>> getSimilarNews(
            @RequestParam(required = false) String currentArticleLink,
            @RequestParam(required = false) String contentHash,
            @RequestParam(required = false) int limit
    ) {

        List<SimilarNewsResponse> data;

        if (currentArticleLink != null) {
            data = similarNewsService.getSimilarNews(currentArticleLink,limit);
        } else if (contentHash != null && !contentHash.isBlank()) {
            data = similarNewsService.getSimilarNewsByContentHash(contentHash, limit);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Either id or contentHash must be provided"
            );
        }
        return ResponseEntity.ok(ApiResponse.success(data));
    }

}