package com.example.news.api.dto.internal.analysis;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GraphNode {
    private String id;      // Unique ID (e.g., entity name)
    private String label;   // Display name
    private String group;   // Entity type (Person, Org, etc.) for coloring
    private double size;    // Importance (e.g., mention count)
    private double sentiment; // Average sentiment of this entity
}
