package com.example.news.api.service.analysis;

import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.analysis.TopRadarResponse;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.repository.analysis.IndexAnalysisRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.Executor;

@Service
public class IndexAnalysisService {
    private static final Logger log = LoggerFactory.getLogger(IndexAnalysisService.class);
    private final IndexAnalysisRepository indexAnalysisRepository;
    private final Executor ioExecutor;

    public IndexAnalysisService(IndexAnalysisRepository indexAnalysisRepository,Executor ioExecutor){
        this.indexAnalysisRepository = indexAnalysisRepository;
        this.ioExecutor = ioExecutor;
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getGlobalTrendsWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<GlobalTrendsResponse> getGlobalTrendsWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(() ->{
            try {
                return indexAnalysisRepository.getGlobalTrendsWithRelativeInterval(intervalUnit, amount);
            } catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);
    }


    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getGlobalEntityWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<GlobalEntityTrendsResponse> getGlobalEntityWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return indexAnalysisRepository.getGlobalEntityWithRelativeInterval(intervalUnit, amount);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);
    }


    @Cacheable(value = "analytics_short_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getImpactArticlesWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<List<InferenceNews>> getImpactArticlesWithRelativeInterval(String intervalUnit, int amount, int topN, boolean isPositive){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return  indexAnalysisRepository.getImpactArticlesWithRelativeInterval(intervalUnit, amount, topN, isPositive);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);
    }

    @Cacheable(value = "analytics_long_ttl",keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getTopicRadarWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<TopRadarResponse> getTopicRadarWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return  indexAnalysisRepository.getTopicRadarWithRelativeInterval(intervalUnit, amount);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);
    }

    @Cacheable(value = "analytics_short_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getEchoChamberWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<List<EchoChamberResponse>> getEchoChamberWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return indexAnalysisRepository.getEchoChamberWithRelativeInterval(intervalUnit, amount);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getEntityVelocityWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<List<EntityVelocityResponse>> getEntityVelocityWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return indexAnalysisRepository.getEntityVelocityWithRelativeInterval(intervalUnit, amount);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);

    }

    @Cacheable(value = "analytics_short_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getMediaPulseOverviewWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<MediaPulseOverviewResponse> getMediaPulseOverviewWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return indexAnalysisRepository.getMediaPulseOverviewWithRelativeInterval(intervalUnit, amount);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);

    }

    @Cacheable(value = "analytics_short_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getSignificantTermsAggregationWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<List<SignificantTermsAggregationResponse>> getSignificantTermsAggregationWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return  indexAnalysisRepository.getSignificantTermsAggregationWithRelativeInterval(intervalUnit, amount);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);

    }

    @Cacheable(value = "analytics_short_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "ElasticIndex", fallbackMethod = "getSentimentVolumeTimelineWithRelativeIntervalFallback")
    @TimeLimiter(name = "ElasticIndex")
    public CompletableFuture<SentimentVolumeTimelineResponse> getSentimentVolumeTimelineWithRelativeInterval (String intervalUnit, int amount, String calendarInterval){
        return CompletableFuture.supplyAsync(() ->{
            try{
                return indexAnalysisRepository.getSentimentVolumeTimelineWithRelativeInterval(intervalUnit, amount, calendarInterval);
            }catch (IOException e) {
                throw new CompletionException(e);
            }
        }, ioExecutor);
    }

    private CompletableFuture<SentimentVolumeTimelineResponse> getSentimentVolumeTimelineWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            String calendarInterval,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(new SentimentVolumeTimelineResponse());
    }

    private CompletableFuture<TopRadarResponse> getTopicRadarWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(new TopRadarResponse());
    }

    private CompletableFuture<GlobalTrendsResponse> getGlobalTrendsWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(new GlobalTrendsResponse());
    }

    private CompletableFuture<GlobalEntityTrendsResponse> getGlobalEntityWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(new GlobalEntityTrendsResponse());
    }

    private CompletableFuture<List<InferenceNews>> getImpactArticlesWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            int topN,
            boolean isPositive,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<EchoChamberResponse>> getEntityVelocityWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<EchoChamberResponse>> getEchoChamberWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<SignificantTermsAggregationResponse>> getSignificantTermsAggregationWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<MediaPulseOverviewResponse> getMediaPulseOverviewWithRelativeIntervalFallback(
            String intervalUnit,
            int amount,
            Throwable t
    ) {
        return CompletableFuture.completedFuture(new MediaPulseOverviewResponse());
    }
}
