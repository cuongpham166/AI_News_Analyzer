package com.example.news.api.dto.internal.admin.metrics.application.keycloak;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class KeycloakApplicationMetrics {
    private int totalRealmRoles;
    private int totalUserEvents;
    private int totalAdminEvents;

    private String status;
    private long totalUsers;
    private long enabledUsers;
    private long disabledUsers;
    private long emailVerifiedUsers;
    private long activeSessions;
    private Map<String, Long> clientSessions;
    private String errorMessage;

    public static KeycloakApplicationMetrics fallbackWithError(String error) {
        return new KeycloakApplicationMetrics(
                0,0,0,
                "DOWN",
                0L, 0L, 0L, 0L, 0L,
                Map.of(),
                error
        );
    }
}
