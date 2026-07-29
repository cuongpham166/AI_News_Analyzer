package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.internal.analysis.GraphLink;
import com.example.news.api.dto.internal.analysis.GraphNode;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GraphResponse {
    private List<GraphNode> nodes = new ArrayList<>();
    private List<GraphLink> links = new ArrayList<>();
}
