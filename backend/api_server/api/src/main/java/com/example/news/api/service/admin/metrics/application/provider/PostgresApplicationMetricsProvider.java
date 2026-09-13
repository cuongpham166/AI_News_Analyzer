package com.example.news.api.service.admin.metrics.application.provider;

import com.example.news.api.repository.user.UserBookmarkRepository;
import org.springframework.stereotype.Component;

@Component
public class PostgresApplicationMetricsProvider {
    private final UserBookmarkRepository userBookmarkRepository;

    public PostgresApplicationMetricsProvider(
            UserBookmarkRepository userBookmarkRepository
    ){
        this.userBookmarkRepository = userBookmarkRepository;
    }
}
