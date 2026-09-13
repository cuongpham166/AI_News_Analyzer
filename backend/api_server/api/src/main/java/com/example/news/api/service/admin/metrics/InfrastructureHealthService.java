package com.example.news.api.service.admin.metrics;

import org.springframework.boot.actuate.health.HealthComponent;
import org.springframework.boot.actuate.health.HealthEndpoint;
import org.springframework.boot.actuate.health.Status;
import org.springframework.stereotype.Service;

@Service
public class InfrastructureHealthService {
    private final HealthEndpoint healthEndpoint;

    public InfrastructureHealthService(HealthEndpoint healthEndpoint) {
        this.healthEndpoint = healthEndpoint;
    }

    public boolean isHealthy(String component) {
        HealthComponent health = healthEndpoint.healthForPath(component);
        return health != null && Status.UP.equals(health.getStatus());
    }
}
