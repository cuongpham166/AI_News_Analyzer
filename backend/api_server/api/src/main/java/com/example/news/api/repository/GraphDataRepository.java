package com.example.news.api.repository;

import com.example.news.api.util.query.GraphDataQuery;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class GraphDataRepository {
    private final Neo4jClient neo4jClient;
    private final GraphDataQuery graphDataQuery;

    public GraphDataRepository(
            Neo4jClient neo4jClient,
            GraphDataQuery graphDataQuery
    ){
        this.neo4jClient = neo4jClient;
        this.graphDataQuery = graphDataQuery;
    }


    public void updateCoordinates(String name, Double latitude, Double longitude, String country, String countryCode){
        neo4jClient.query(graphDataQuery.updateCoordinates())
                .bind(name).to("name")
                .bind(latitude).to("latitude")
                .bind(longitude).to("longitude")
                .bind(country).to("country")
                .bind(countryCode).to("country_code")
                .run();
    }

    public void updateUnitedNationsCoordinates(Double latitude, Double longitude, String country, String countryCode){
        List<String> names = List.of("United Nations headquarters", "UN Headquarters");
        neo4jClient.query(graphDataQuery.updateUnitedNationsCoordinates())
                .bind(names).to("names")
                .bind(latitude).to("latitude")
                .bind(longitude).to("longitude")
                .bind(country).to("country")
                .bind(countryCode).to("country_code")
                .run();
    }

    public void syncCoordinationDataFromPostgres(
            String name,
            Double latitude,
            Double longitude,
            String country,
            String countryCode) {

        neo4jClient.query(graphDataQuery.syncCoordinationDataFromPostgres())
                .bind(name).to("name")
                .bind(latitude).to("latitude")
                .bind(longitude).to("longitude")
                .bind(country).to("country")
                .bind(countryCode).to("countryCode")
                .run();
    }
}
