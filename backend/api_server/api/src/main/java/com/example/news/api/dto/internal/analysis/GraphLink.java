package com.example.news.api.dto.internal.analysis;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GraphLink {
    private String source;
    private String target;
    private double value;
    private double sentiment;
}
