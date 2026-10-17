package com.example.news.api.dto.internal.news.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EntityTypeCount {
    private Long id;
    private String name;
    private Long entityCount;
}
