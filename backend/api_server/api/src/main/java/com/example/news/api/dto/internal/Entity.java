package com.example.news.api.dto.internal;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class Entity {
    @JsonProperty("value")
    private String value;

    @JsonProperty("entity_type")
    private String entityType;

    public Entity(String value, String entityType) {
        this.value = value;
        this.entityType = entityType;
    }

    @Override
    public String toString() {
        return "{" +
                "value:'" + value + '\'' +
                ", entityType:'" + entityType + '\'' +
                '}';
    }
}