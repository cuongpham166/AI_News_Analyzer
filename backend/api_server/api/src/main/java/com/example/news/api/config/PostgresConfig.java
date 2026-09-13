package com.example.news.api.config;

import java.sql.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PostgresConfig {

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String user;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    public Connection postgresConnection() {
        try{
            return DriverManager.getConnection(url,user,password);
        }catch (SQLException e) {
            throw new IllegalStateException("Unable to create Postgres connection", e);
        }
    }
}
