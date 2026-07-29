package com.example.news.api.dto.response.analysis.index;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EntityVelocityResponse {
    private String entity;
    private long currentMentions;
    private long previousMentions;
    private double velocityPercentage;
}
