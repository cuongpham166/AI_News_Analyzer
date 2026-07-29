package com.example.news.api.dto.response.analysis.index;

import com.example.news.api.dto.internal.TimelineBucket;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SentimentVolumeTimelineResponse {
    private List<TimelineBucket> timeline;
}
