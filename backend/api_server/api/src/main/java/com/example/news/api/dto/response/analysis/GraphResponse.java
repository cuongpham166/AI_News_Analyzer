package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.internal.GraphLink;
import com.example.news.api.dto.internal.GraphNode;

import java.util.ArrayList;
import java.util.List;

public class GraphResponse {
    private List<GraphNode> nodes = new ArrayList<>();
    private List<GraphLink> links = new ArrayList<>();

    public GraphResponse() {
    }

    public GraphResponse(List<GraphNode> nodes, List<GraphLink> links) {
        this.nodes = nodes;
        this.links = links;
    }

    public List<GraphNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<GraphNode> nodes) {
        this.nodes = nodes;
    }

    public List<GraphLink> getLinks() {
        return links;
    }

    public void setLinks(List<GraphLink> links) {
        this.links = links;
    }
}
