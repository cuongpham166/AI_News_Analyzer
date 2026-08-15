package com.example.news.api.repository;

import com.example.news.api.entity.LocationCoordinatesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocationCoordinatesRepository extends JpaRepository<LocationCoordinatesEntity, Long> {
    Optional<LocationCoordinatesEntity> findByLocationNameIgnoreCase(String locationName);
    Optional<LocationCoordinatesEntity> findByLocationName(String locationName);
}
