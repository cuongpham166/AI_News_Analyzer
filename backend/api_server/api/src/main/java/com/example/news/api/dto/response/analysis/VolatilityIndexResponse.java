package com.example.news.api.dto.response.analysis;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class VolatilityIndexResponse {
    private String entity_name;
    private float avg_sentiment;
    private float volatility;
    private int mentions;
}
