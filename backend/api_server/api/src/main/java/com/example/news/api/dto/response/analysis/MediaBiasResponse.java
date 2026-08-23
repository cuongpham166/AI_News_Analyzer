package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.response.analysis.graph.PublisherFocusResponse;
import com.example.news.api.dto.response.analysis.graph.SourceCoverageResponse;
import com.example.news.api.dto.response.analysis.graph.TrendingKeywordClusterResponse;
import com.example.news.api.dto.response.analysis.index.EchoChamberResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MediaBiasResponse {
    private List<SourceCoverageResponse> sourceCoverage;
    private List<PublisherFocusResponse> publisherFocus;
    private List<EchoChamberResponse> echoChamber;
    private List<TrendingKeywordClusterResponse> trendingKeyword;
}
