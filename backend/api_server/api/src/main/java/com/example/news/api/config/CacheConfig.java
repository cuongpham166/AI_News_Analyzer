package com.example.news.api.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.caffeine.CaffeineCacheManager;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();

        cacheManager.setAsyncCacheMode(true);

        //frequently changing, high-volume, or real-time metrics.
        cacheManager.registerCustomCache(
                "analytics_short_ttl",
                Caffeine.newBuilder()
                        .initialCapacity(100)
                        .maximumSize(500)
                        .expireAfterWrite(5, TimeUnit.MINUTES)
                        .recordStats()
                        .buildAsync()
        );

        //slow-changing, macro-level, or extremely heavy graph calculations.
        cacheManager.registerCustomCache(
                "analytics_long_ttl",
                Caffeine.newBuilder()
                        .initialCapacity(50)
                        .maximumSize(200)
                        .expireAfterWrite(1, TimeUnit.HOURS)
                        .recordStats()
                        .buildAsync()
        );
        return cacheManager;
    }
}
