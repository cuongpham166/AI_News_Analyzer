package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.internal.TopicDistribution;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TopRadarResponse {
    private long count;
    private List<TopicDistribution> distribution;
}
