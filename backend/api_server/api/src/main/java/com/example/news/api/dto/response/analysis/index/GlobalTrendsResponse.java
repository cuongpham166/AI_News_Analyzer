package com.example.news.api.dto.response.analysis.index;

import com.example.news.api.dto.internal.TrendBucket;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GlobalTrendsResponse {
    private List<TrendBucket> timeline;
}
