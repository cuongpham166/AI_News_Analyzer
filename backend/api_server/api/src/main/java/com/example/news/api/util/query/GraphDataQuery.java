package com.example.news.api.util.query;

import org.springframework.stereotype.Component;

@Component
public class GraphDataQuery {
    public GraphDataQuery(){}

    public String updateCoordinates(){
        return """
            MATCH (l:Location)
            WHERE l.name = $name
            SET l.latitude = $latitude,
                l.longitude = $longitude
        """;
    }


    public String updateUnitedNationsCoordinates(){
        return """
            MATCH (l:Location)
            WHERE l.name IN $names
            SET l.latitude = $latitude,
                l.longitude = $longitude
        """;
    }
}
