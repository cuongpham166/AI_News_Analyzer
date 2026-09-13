package com.example.news.api.service.analysis;

import com.example.news.api.dto.response.analysis.index.GlobalEntityTrendsResponse;
import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
import com.example.news.api.repository.analysis.AnalyticsRepository;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository){
        this.analyticsRepository = analyticsRepository;
    }

    public GlobalTrendsResponse getAnalyticsGlobalTrendsWithRelativeInterval(
            String intervalUnit,
            int amount,
            String calendarInterval
    ){
        return analyticsRepository.getAnalyticsGlobalTrendsWithRelativeInterval(intervalUnit,amount,calendarInterval);
    }

    public GlobalEntityTrendsResponse getAnalyticsGlobalEntitiesTrendsWithRelativeInterval(
            String intervalUnit,
            int amount,
            String calendarInterval
    ){
        return analyticsRepository.getAnalyticsGlobalEntitiesTrendsWithRelativeInterval(intervalUnit,amount,calendarInterval);
    }
}
