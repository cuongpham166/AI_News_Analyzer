package com.example.news.api.dto.internal.entity;

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
