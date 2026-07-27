package com.example.news.api.dto.internal;

public record DiscoveryLinkRecord(
        String source,
        String sourceGroup,
        String target,
        String targetGroup,
        Double weight,
        Double sentiment
) {
}
