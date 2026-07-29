package com.example.news.api.dto.internal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PublisherDistribution {
    private String publisher;
    private long articleCount;
}
