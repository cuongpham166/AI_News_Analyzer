package com.example.news.api.dto.response.admin;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RssSourceResponse {
    private Long id;
    private String url;
    private String sourceName;
    private Boolean enabled;
    private OffsetDateTime createdAt;
}
