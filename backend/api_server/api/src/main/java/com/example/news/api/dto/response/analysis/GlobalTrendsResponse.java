package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.internal.TrendBucket;

import java.util.List;

public class GlobalTrendsResponse {
    private List<TrendBucket> timeline;

    public GlobalTrendsResponse() {}
    
    public GlobalTrendsResponse(List<TrendBucket> timeline) {
        this.timeline = timeline;
    }

    public List<TrendBucket> getTimeline() {
        return this.timeline;
    }

    public void setTimeline(List<TrendBucket> timeline) {
        this.timeline = timeline;
    }

    @Override
    public String toString() {
        return "{" +
            " timeline='" + getTimeline() + "'" +
            "}";
    }


}
