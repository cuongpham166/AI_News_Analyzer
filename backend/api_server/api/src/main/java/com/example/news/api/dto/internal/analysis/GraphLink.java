package com.example.news.api.dto.internal.analysis;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GraphLink {
    private String source;  // ID of the start node
    private String target;  // ID of the end node
    private double value;   // Connection strength (weight)
    private double sentiment; // Mood of the relationship
}
