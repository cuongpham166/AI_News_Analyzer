package com.example.news.api.dto.response.analysis.index;

import com.example.news.api.dto.internal.PublisherDistribution;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EchoChamberResponse{
    private String contentHash;
    private String sampleTitle;
    private long totalDuplications;
    private List<PublisherDistribution> publishers;
}
