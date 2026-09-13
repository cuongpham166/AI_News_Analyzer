package com.example.news.api.dto.internal.admin.metrics.pipeline.clickhouse;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClickHouseStatistic {

    private String name;
    private long total;
}
