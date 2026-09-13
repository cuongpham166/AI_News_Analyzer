package com.example.news.api.config;

import com.clickhouse.client.api.Client;
import com.clickhouse.client.api.Client.Builder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ClickHouseConfig {
    @Value("${spring.clickhouse.url}")
    private String url;

    @Value("${spring.clickhouse.database}")
    private String database;

    @Value("${spring.clickhouse.username}")
    private String username;

    @Value("${spring.clickhouse.password}")
    private String password;

    @Bean
    public Client clickHouseClient() {
        return new Client.Builder()
                .addEndpoint(url)
                .setUsername(username)
                .setPassword(password)
                .setDefaultDatabase(database)
                .build();
    }

}
