package com.example.news.api.dto.internal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EntityCount {
    private String name;
    private long count;
    private Double averageSentiment;
}
