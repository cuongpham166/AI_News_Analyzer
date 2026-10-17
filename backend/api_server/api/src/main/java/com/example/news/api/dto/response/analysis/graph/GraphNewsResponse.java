package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GraphNewsResponse {
    private String title;
    private Double sentiment;
    private String date;
    private String source;
    private String contentHash;
}
