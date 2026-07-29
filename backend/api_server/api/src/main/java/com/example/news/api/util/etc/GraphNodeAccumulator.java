package com.example.news.api.util.etc;

import com.example.news.api.dto.internal.analysis.GraphNode;
import lombok.Getter;

@Getter
public class GraphNodeAccumulator {
    private final String id;
    private final String group;
    private double totalWeight = 0;
    private double weightedSentimentSum = 0;

    public GraphNodeAccumulator(String id, String group) {
        this.id = id;
        this.group = group;
    }

    public void addConnection(double weight, double sentiment) {
        this.totalWeight += weight;
        this.weightedSentimentSum += (sentiment * weight);
    }

    public GraphNode build() {
        double avgSentiment = totalWeight > 0 ? (weightedSentimentSum / totalWeight) : 0.0;
        double roundedSentiment = Math.round(avgSentiment * 100.0) / 100.0;
        return new GraphNode(this.id, this.id, this.group, this.totalWeight, roundedSentiment);
    }

}
