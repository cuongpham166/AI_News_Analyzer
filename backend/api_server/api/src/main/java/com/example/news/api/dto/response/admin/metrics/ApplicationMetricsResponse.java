package com.example.news.api.dto.response.admin.metrics;

import com.example.news.api.dto.internal.admin.metrics.application.keycloak.KeycloakApplicationMetrics;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ApplicationMetricsResponse {
    private KeycloakApplicationMetrics keycloakApplicationMetrics;
}
