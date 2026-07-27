package com.example.news.api.dto.response.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminEventResponse {
    private String operationType;
    private String resourceType;
    private String resourcePath;
    private String adminUserId;
    private Long timestamp;
}
