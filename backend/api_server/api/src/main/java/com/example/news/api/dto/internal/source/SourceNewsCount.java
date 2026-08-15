package com.example.news.api.dto.internal.source;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SourceNewsCount {
    private Long id;
    private String name;
    private Long newsCount;
}
