package com.example.news.api.dto.response.analysis.index;

import com.example.news.api.dto.internal.EntityCount;

import java.util.Map;
import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class GlobalEntityTrendsResponse {
    private Map<String, List<EntityCount>> timeline;
}
