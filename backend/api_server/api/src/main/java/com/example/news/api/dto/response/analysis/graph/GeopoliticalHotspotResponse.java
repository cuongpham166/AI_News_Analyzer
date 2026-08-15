package com.example.news.api.dto.response.analysis.graph;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class GeopoliticalHotspotResponse {
    private String location;
    private String topic;
    private int articleCount;
    private Double avgSentiment;

    private List<String> aliases;
    private double latitude;
    private double longitude;
    private String country;
    private String countryCode;

}
