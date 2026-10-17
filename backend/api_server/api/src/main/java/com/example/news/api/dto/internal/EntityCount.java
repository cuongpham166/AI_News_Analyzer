package com.example.news.api.dto.internal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EntityCount {
    private String name;
    private String type; // new
    private long count;
    private Double averageSentiment;

    /*NEW*/
    private long positiveVolume;
    private long negativeVolume;
    private Double riskScore;
    /*NEW*/
}
