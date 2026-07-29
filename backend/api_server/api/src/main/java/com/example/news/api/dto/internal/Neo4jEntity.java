package com.example.news.api.dto.internal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Neo4jEntity {
    private String news_link;
    private String entity_name;
}
