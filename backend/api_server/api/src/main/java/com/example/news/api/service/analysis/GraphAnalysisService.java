package com.example.news.api.service.analysis;

import com.example.news.api.dto.response.analysis.GraphResponse;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.repository.analysis.GraphAnalysisRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;


@Service
public class GraphAnalysisService {
    private static final Logger log = LoggerFactory.getLogger(GraphAnalysisService.class);
    private final GraphAnalysisRepository graphAnalysisRepository;
    private final Executor ioExecutor;

    public GraphAnalysisService(GraphAnalysisRepository graphAnalysisRepository,Executor ioExecutor){
        this.graphAnalysisRepository = graphAnalysisRepository;
        this.ioExecutor = ioExecutor;
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getPowerCoupleWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<PowerCouplesResponse>> getPowerCoupleWithRelativeInterval (String intervalUnit, int amount){

        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getPowerCoupleWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getEventTrackerWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<EventTrackerResponse>> getEventTrackerWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getEventTrackerWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getEventTrackerMetricsWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<EventTrackerMetricsResponse> getEventTrackerMetricsWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getEventTrackerMetricsWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getGeopoliticalHotspotWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<GeopoliticalHotspotResponse>> getGeopoliticalHotspotWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getGeopoliticalHotspotWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getGeopoliticalMetricsWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<GeopoliticalMetricsResponse> getGeopoliticalMetricsWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getGeopoliticalMetricsWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }


    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getNarrativeBridgeWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<NarrativeBridgeResponse>> getNarrativeBridgeWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getNarrativeBridgeWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getPublisherFocusWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<PublisherFocusResponse>> getPublisherFocusWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getPublisherFocusWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getInfluencerNetworkWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<InfluencerNetworkResponse>> getInfluencerNetworkWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getInfluencerNetworkWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getSpatialMapWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<SpatialMapResponse>> getSpatialMapWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getSpatialMapWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getAllianceNetworkWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<AllianceNetworkResponse>> getAllianceNetworkWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getAllianceNetworkWithRelativeInterval(intervalUnit,amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getMediaBiasWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<SourceCoverageResponse>> getMediaBiasWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getMediaBiasWithRelativeInterval(intervalUnit, amount),
                ioExecutor

        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getCrisisAndRiskRadarWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<CrisisAndRiskRadarResponse>> getCrisisAndRiskRadarWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getCrisisAndRiskRadarWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getTrendingKeywordClusterWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<TrendingKeywordClusterResponse>> getTrendingKeywordClusterWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getTrendingKeywordClusterWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getEntitiesGraphWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<GraphResponse> getEntitiesGraphWithRelativeInterval(String intervalUnit, int amount) {
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getEntitiesGraphWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getEntityCoOccurrenceMatrixWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<CoOccurrenceCellResponse>> getEntityCoOccurrenceMatrixWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getEntityCoOccurrenceMatrixWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getEntityPolarizationWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<EntityPolarizationResponse>> getEntityPolarizationWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getEntityPolarizationWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getCountryRiskWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<CountryRiskResponse>> getCountryRiskWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getCountryRiskWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getEventRiskRadarWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<EventRiskRadarResponse>> getEventRiskRadarWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getEventRiskRadarWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    @Cacheable(value = "analytics_long_ttl", keyGenerator = "methodKeyGenerator")
    @CircuitBreaker(name = "Neo4jGraph", fallbackMethod = "getEventMomentumWithRelativeIntervalFallback")
    @TimeLimiter(name = "Neo4jGraph")
    public CompletableFuture<List<EventMomentumResponse>> getEventMomentumWithRelativeInterval (String intervalUnit, int amount){
        return CompletableFuture.supplyAsync(
                () -> graphAnalysisRepository.getEventMomentumWithRelativeInterval(intervalUnit, amount),
                ioExecutor
        );
    }

    private void showFallbackLog(Throwable t){
        log.warn("Neo4j call failed or timed out. Reason: {}. Returning empty fallback.", t.getMessage());
    }

    private CompletableFuture<List<PowerCouplesResponse>> getPowerCoupleWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<EventTrackerResponse>> getEventTrackerWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<GeopoliticalHotspotResponse>> getGeopoliticalHotspotWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<NarrativeBridgeResponse>> getNarrativeBridgeWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<PublisherFocusResponse>> getPublisherFocusWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<InfluencerNetworkResponse>> getInfluencerNetworkWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<SpatialMapResponse>> getSpatialMapWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<AllianceNetworkResponse>> getAllianceNetworkWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<SourceCoverageResponse>> getMediaBiasWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<CrisisAndRiskRadarResponse>> getCrisisAndRiskRadarWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<TrendingKeywordClusterResponse>> getTrendingKeywordClusterWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<GraphResponse> getEntitiesGraphWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        GraphResponse defaultResult = new GraphResponse();
        return CompletableFuture.completedFuture(defaultResult);
    }

    private CompletableFuture<List<CoOccurrenceCellResponse>> getEntityCoOccurrenceMatrixWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<EntityPolarizationResponse>> getEntityPolarizationWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private  CompletableFuture<GeopoliticalMetricsResponse> getGeopoliticalMetricsWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        GeopoliticalMetricsResponse defaultResult = new GeopoliticalMetricsResponse();
        showFallbackLog(t);
        return CompletableFuture.completedFuture(defaultResult);
    }

    private CompletableFuture<List<CountryRiskResponse>> getCountryRiskWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<EventTrackerMetricsResponse> getEventTrackerMetricsWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        EventTrackerMetricsResponse defaultResult = new EventTrackerMetricsResponse();
        return CompletableFuture.completedFuture(defaultResult);
    }

    private CompletableFuture<List<EventRiskRadarResponse>> getEventRiskRadarWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }

    private CompletableFuture<List<EventRiskRadarResponse>> getEventMomentumWithRelativeIntervalFallback(
            String intervalUnit, int amount, Throwable t
    ) {
        showFallbackLog(t);
        return CompletableFuture.completedFuture(Collections.emptyList());
    }
}
