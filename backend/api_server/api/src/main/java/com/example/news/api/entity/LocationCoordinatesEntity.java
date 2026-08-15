package com.example.news.api.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Setter
@Getter
@ToString
@Entity
@Table(
        name = "location_coordinates",
        uniqueConstraints = @UniqueConstraint(columnNames = "location_name")
)
public class LocationCoordinatesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_name", nullable = false, unique = true)
    private String locationName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String country;

    @Column(name = "country_code", nullable = false)
    private String countryCode;

    @Column(name = "created_at", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    public LocationCoordinatesEntity() {}

    public LocationCoordinatesEntity(String locationName, Double latitude, Double longitude, String country, String countryCode) {
        this.locationName = locationName;
        this.latitude = latitude;
        this.longitude = longitude;
        this.country = country;
        this.countryCode = countryCode;
    }
}
