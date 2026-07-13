package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.internal.TopicDistribution;

import java.util.List;

public class TopRadarResponse {
    private long count;
    private List<TopicDistribution> distribution;


    public TopRadarResponse() {
    }

    public TopRadarResponse(long count, List<TopicDistribution> distribution) {
        this.count = count;
        this.distribution = distribution;
    }

    public long getCount() {
        return this.count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public List<TopicDistribution> getDistribution() {
        return this.distribution;
    }

    public void setDistribution(List<TopicDistribution> distribution) {
        this.distribution = distribution;
    }

    @Override
    public String toString() {
        return "{" +
            " count='" + getCount() + "'" +
            ", distribution='" + getDistribution() + "'" +
            "}";
    }

}
