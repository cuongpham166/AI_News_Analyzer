package com.example.news.api.repository;

import com.example.news.api.entity.LocationCoordinatesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationCoordinatesRepository extends JpaRepository<LocationCoordinatesEntity, Long> {
    Optional<LocationCoordinatesEntity> findByLocationNameIgnoreCase(String locationName);
    Optional<LocationCoordinatesEntity> findByLocationName(String locationName);

    @Query("""
        SELECT l
        FROM LocationCoordinatesEntity l
        WHERE l.latitude = 0.0
          AND l.longitude = 0.0
        ORDER BY l.id ASC
    """)
    List<LocationCoordinatesEntity> findLocationsWithZeroCoordinates();

    @Modifying
    @Transactional
    @Query("""
        UPDATE LocationCoordinatesEntity l
        SET l.latitude = :latitude,
            l.longitude = :longitude,
            l.country = :country,
            l.countryCode = :countryCode
        WHERE l.locationName = :locationName
    """)
    int updateCoordinatesByLocationName(
            @Param("locationName") String locationName,
            @Param("latitude") Double latitude,
            @Param("longitude") Double longitude,
            @Param("country") String country,
            @Param("countryCode") String countryCode
    );
}
