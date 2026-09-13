package com.example.news.api.service.admin.metrics.application;

import com.example.news.api.dto.internal.admin.metrics.application.keycloak.KeycloakApplicationMetrics;
import com.example.news.api.dto.internal.admin.metrics.pipeline.PostgresPipelineMetrics;
import com.example.news.api.dto.response.admin.metrics.ApplicationMetricsResponse;
import com.example.news.api.service.admin.metrics.application.provider.KeycloakMetricsProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;

@Service
public class ApplicationMetricsService {
    private final Executor ioExecutor;
    private final KeycloakMetricsProvider keycloakMetricsProvider;

    public ApplicationMetricsService(
            Executor ioExecutor,
            KeycloakMetricsProvider keycloakMetricsProvider
    ){
        this.ioExecutor = ioExecutor;
        this.keycloakMetricsProvider = keycloakMetricsProvider;
    }

    @Cacheable(value = "application_db_metrics", keyGenerator = "methodKeyGenerator")
    public ApplicationMetricsResponse getApplicationMetrics(){

        CompletableFuture<KeycloakApplicationMetrics> keycloakFuture = CompletableFuture
                .supplyAsync(keycloakMetricsProvider::getKeycloakApplicationMetrics, ioExecutor)
                .exceptionally(ex -> KeycloakApplicationMetrics.fallbackWithError(ex.getMessage()));

        CompletableFuture.allOf(
                keycloakFuture
        ).join();

        return new ApplicationMetricsResponse(
                keycloakFuture.join()
        );
    }


}
