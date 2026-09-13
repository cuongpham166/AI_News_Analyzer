package com.example.news.api.dto.internal.news.topic;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TopicNewsCount {
    private Long id;
    private String name;
    private Long newsCount;
}
