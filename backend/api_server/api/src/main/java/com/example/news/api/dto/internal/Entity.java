package com.example.news.api.dto.internal;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Entity {
    @JsonProperty("value")
    private String value;

    @JsonProperty("entity_type")
    private String entityType;
}