package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.internal.EntityCount;

import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

public class GlobalEntityTrendsResponse {
    private Map<String, List<EntityCount>> timeline;


    public GlobalEntityTrendsResponse() {
    }

    public GlobalEntityTrendsResponse(Map<String,List<EntityCount>> timeline) {
        this.timeline = timeline;
    }

    public Map<String,List<EntityCount>> getTimeline() {
        return this.timeline;
    }

    public void setTimeline(Map<String,List<EntityCount>> timeline) {
        this.timeline = timeline;
    }



    @Override
    public String toString() {
        if (timeline == null) return "{}";

        String timelineStr = timeline.entrySet().stream()
            .map(entry -> "\"" + entry.getKey() + "\": " + entry.getValue())
            .collect(Collectors.joining(", "));

        return "{ " + timelineStr + " }";
    }


}
