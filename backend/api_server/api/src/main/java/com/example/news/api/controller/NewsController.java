package com.example.news.api.controller;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.dto.response.news.RecommendedNewsResponse;
import com.example.news.api.entity.NewsReactionEntity;
import com.example.news.api.service.GraphRecommendationService;
import com.example.news.api.service.RecommendationEngineService;
import com.example.news.api.service.news.NewsBookmarkService;
import com.example.news.api.service.news.NewsReactionService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;


import com.example.news.api.service.news.NewsService;

@RestController
@RequestMapping("/api/news")
public class NewsController {
    private final NewsService metadataService;
    private final NewsBookmarkService newsBookmarkService;
    private final NewsReactionService newsReactionService;
    private final GraphRecommendationService graphRecommendationService;
    private final RecommendationEngineService recommendationEngineService;

    public NewsController(
            NewsService metadataService,
            NewsBookmarkService newsBookmarkService,
            NewsReactionService newsReactionService,
            GraphRecommendationService graphRecommendationService,
            RecommendationEngineService recommendationEngineService
    ) {
        this.metadataService = metadataService;
        this.newsBookmarkService = newsBookmarkService;
        this.newsReactionService = newsReactionService;
        this.graphRecommendationService = graphRecommendationService;
        this.recommendationEngineService = recommendationEngineService;
    }

    @GetMapping("/all")
    public List<DetailedNewsResponse> getAllNews(@RequestParam(required = false, defaultValue = "10") int limit) {
        return this.metadataService.getAllNews(limit);
    }

    @GetMapping("/all/source")
    public List<DetailedNewsResponse> getAllNewsBySourceId(@RequestParam int sourceId) {
        return this.metadataService.getAllNewsBySourceId(sourceId);
    }

    @GetMapping("/detail")
    public DetailedNewsResponse getNewsByLink(@RequestParam String link) {
        return this.metadataService.getDetailedNewsByLink(link);
    }

    @PostMapping("/{newsId}/bookmark")
    public void addBookmark(@PathVariable int newsId, JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        newsBookmarkService.addBookmark(newsId,userId);

        CompletableFuture.runAsync(() -> graphRecommendationService.syncBookmark(userId, newsId))
                .exceptionally(ex -> {
                    System.err.println("Failed to sync bookmark to Neo4j: " + ex.getMessage());
                    return null;
                });
    }

    @DeleteMapping("/{newsId}/bookmark")
    public void removeBookmark(@PathVariable int newsId, JwtAuthenticationToken authentication) {
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        newsBookmarkService.removeBookmark(newsId,userId);

        CompletableFuture.runAsync(() -> graphRecommendationService.removeBookmark(userId,newsId))
                .exceptionally(ex -> {
                    System.err.println("Failed to remove bookmark to Neo4j: " + ex.getMessage());
                    return null;
                });
    }

    @PostMapping("/{newsId}/reaction")
    public void postReaction(@PathVariable int newsId, @PathVariable ReactionType reactionType, JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();

        Optional<NewsReactionEntity> existingReaction = newsReactionService.findNewsReaction(newsId,userId);

        if (existingReaction.isPresent()) {
            ReactionType savedType = existingReaction.get().getType();
            if (savedType == reactionType) {
                newsReactionService.removeReaction(existingReaction.get());
                CompletableFuture.runAsync(() -> graphRecommendationService.removeReaction(userId, newsId));
            }else{
                newsReactionService.postReaction(newsId,userId,reactionType);
                CompletableFuture.runAsync(() -> graphRecommendationService.syncReaction(userId, newsId, reactionType));
            }
        }else{
            newsReactionService.postReaction(newsId,userId,reactionType);
            CompletableFuture.runAsync(() -> graphRecommendationService.syncReaction(userId, newsId, reactionType));
        }
    }

    @GetMapping("/personalized")
    public List<RecommendedNewsResponse> getPersonalizedFeed(JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        return recommendationEngineService.getPersonalizedFeed(userId,10);
    }


}