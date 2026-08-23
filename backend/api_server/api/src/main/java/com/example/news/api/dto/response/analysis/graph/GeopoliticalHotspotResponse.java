package com.example.news.api.dto.response.analysis.graph;

import com.example.news.api.dto.internal.news.GeopoliticalHotspotTopic;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GeopoliticalHotspotResponse {
    private String location;
    private int articleCount;
    private Double avgSentiment;

    private List<GeopoliticalHotspotTopic> topics;

    private List<String> aliases;
    private double latitude;
    private double longitude;
    private String country;
    private String countryCode;

}
