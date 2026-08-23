package com.example.news.api.dto.response.analysis.graph;

import com.example.news.api.dto.internal.event.EventMomentumTimeline;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EventMomentumResponse {
    private String event;
    private List<EventMomentumTimeline> timeline;
    private int totalVolume;
}
