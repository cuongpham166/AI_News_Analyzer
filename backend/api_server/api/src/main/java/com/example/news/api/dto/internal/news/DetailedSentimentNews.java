package com.example.news.api.dto.internal.news;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DetailedSentimentNews {
    private String label;
    private BigDecimal score;
}
