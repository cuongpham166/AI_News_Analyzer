package com.example.news.api.dto.internal.admin.metrics.pipeline.elasticsearch;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ElasticsearchIndexStatistics {
    private String name;
    private long documents;
    private long sizeInBytes;
}
