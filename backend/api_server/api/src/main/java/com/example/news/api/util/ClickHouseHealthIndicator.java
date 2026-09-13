package com.example.news.api.util;

import com.clickhouse.client.api.Client;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component("clickhouse")
public class ClickHouseHealthIndicator  implements HealthIndicator {
    private final Client clickHouseClient;

    public ClickHouseHealthIndicator(Client clickHouseClient) {
        this.clickHouseClient = clickHouseClient;
    }

    @Override
    public Health health() {
        try {
            if (clickHouseClient.ping()) {
                return Health.up().build();
            }
            return Health.down().build();

        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
