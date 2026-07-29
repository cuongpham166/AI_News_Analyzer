package com.example.news.api.dto.internal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DetailedEntity {
    private Integer entityId;
    private String entityName;
    private String entityTypeName;
    private Integer entityTypeId;
}
