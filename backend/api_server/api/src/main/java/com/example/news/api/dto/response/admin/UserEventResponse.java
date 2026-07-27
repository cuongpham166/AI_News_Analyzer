package com.example.news.api.dto.response.admin;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserEventResponse {
    private String eventType;
    private String userId;
    private String clientId;
    private String ipAddress;
    private Long timestamp;
}
