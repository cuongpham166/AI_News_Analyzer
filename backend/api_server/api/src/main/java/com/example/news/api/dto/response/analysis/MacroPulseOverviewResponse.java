package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.internal.entity.EntityTypeCount;
import com.example.news.api.dto.internal.source.SourceNewsCount;
import com.example.news.api.dto.internal.topic.TopicNewsCount;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MacroPulseOverviewResponse {
    private Long totalNews;
    private Long totalInference;
    private List<SourceNewsCount> sourceNewsCounts;
    private List<EntityTypeCount> entityTypeCounts;
    private List<TopicNewsCount> topicNewsCounts;
    private long totalArticles;
    private long uniqueStories;
    private double amplificationRatio;
}
