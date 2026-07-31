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
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/detail")
    public ResponseEntity<ApiResponse<DetailedNewsResponse>> getNewsByLink(@RequestParam UUID Id) {
        DetailedNewsResponse data = newsService.getDetailedNews(Id);
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/{newsId}/bookmark")
    public void addBookmark(@PathVariable UUID newsId, JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        userInteractionService.addJpaBookmark(newsId,userId);

        CompletableFuture.runAsync(() -> userInteractionService.addGraphBookmark(userId, newsId))
                .exceptionally(ex -> {
                    System.err.println("Failed to sync bookmark to Neo4j: " + ex.getMessage());
                    return null;
                });
    }

    @DeleteMapping("/{newsId}/bookmark")
    public void removeBookmark(@PathVariable UUID newsId, JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        userInteractionService.removeJpaBookmark(newsId,userId);

        CompletableFuture.runAsync(() -> userInteractionService.removeGraphBookmark(userId,newsId))
                .exceptionally(ex -> {
                    System.err.println("Failed to remove bookmark to Neo4j: " + ex.getMessage());
                    return null;
                });
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
                CompletableFuture.runAsync(() -> userInteractionService.removeGraphReaction(userId, newsId));
            }else{
                userInteractionService.addJpaReaction(newsId,userId,reactionType);
                CompletableFuture.runAsync(() -> userInteractionService.addGraphReaction(userId, newsId, reactionType));
            }
        }else{
            userInteractionService.addJpaReaction(newsId,userId,reactionType);
            CompletableFuture.runAsync(() -> userInteractionService.addGraphReaction(userId, newsId, reactionType));
        }
    }

    @GetMapping("/personalized")
    public List<RecommendedNewsResponse> getPersonalizedFeed(JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        return recommendedNewsService.getPersonalizedFeed(userId,10);
    }

    @GetMapping("/similar")
    public List<SimilarNewsResponse> getSimilarNews(String currentArticleLink, int limit) {
        return similarNewsService.getSimilarNews(currentArticleLink,limit);
    }

}