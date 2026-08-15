package com.example.news.api.service;
import com.example.news.api.entity.EntityEntity;
import com.example.news.api.entity.LocationCoordinatesEntity;
import com.example.news.api.repository.entity.EntityRepository;
import com.example.news.api.repository.entity.EntityTypeRepository;
import com.example.news.api.repository.GraphDataRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.news.api.repository.LocationCoordinatesRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import org.springframework.http.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class LocationService {
    private static final Logger log = LoggerFactory.getLogger(LocationService.class);
    private final RestTemplate restTemplate = new RestTemplate();

    private final LocationCoordinatesRepository locationRepository;
    private final EntityRepository entityRepository;
    private final EntityTypeRepository entityTypeRepository;
    private final GraphDataRepository graphDataRepository;

    public LocationService(
            LocationCoordinatesRepository locationRepository,
            EntityRepository entityRepository,
            EntityTypeRepository entityTypeRepository,
            GraphDataRepository graphDataRepository
    ) {
        this.locationRepository = locationRepository;
        this.entityRepository = entityRepository;
        this.entityTypeRepository = entityTypeRepository;
        this.graphDataRepository = graphDataRepository;
    }

    public void syncCoordinationDataFromPostgres(){
        List<LocationCoordinatesEntity> locations = locationRepository.findAll();
        for (LocationCoordinatesEntity location : locations) {
            graphDataRepository.syncCoordinationDataFromPostgres(
                    location.getLocationName(),
                    location.getLatitude(),
                    location.getLongitude(),
                    location.getCountry(),
                    location.getCountryCode()
            );
            log.info(
                    "Synced location to Neo4j: {} -> {}, {} ({}, {})",
                    location.getLocationName(),
                    location.getLatitude(),
                    location.getLongitude(),
                    location.getCountry(),
                    location.getCountryCode()
            );
        }
    }
    public void syncLocationToLocationCoordinatesTable(){
        List<String> locationNames = getAllLocationEntity();
        List<LocationCoordinatesEntity> locationCoordinatesList = new ArrayList<>();
        for (String originalLocationName : locationNames) {
            Optional<LocationCoordinatesEntity> geocoded = locationRepository.findByLocationName(originalLocationName);
            Optional<EntityEntity> foundEntity = entityRepository.findByValue(originalLocationName);
            if (geocoded.isEmpty() && foundEntity.isPresent()) {
                LocationCoordinatesEntity newEntity = new LocationCoordinatesEntity();
                newEntity.setId(foundEntity.get().getId());
                newEntity.setLocationName(originalLocationName);
                newEntity.setLongitude(0.0);
                newEntity.setLatitude(0.0);
                newEntity.setCountry("Unknown");
                newEntity.setCountryCode("XX");
                locationCoordinatesList.add(newEntity);
            }
        }
        locationRepository.saveAll(locationCoordinatesList);
    }

    @Async
    public void syncLocationCoordinatesEntity() {

        List<String> locationNames = getAllLocationEntity();

        for (String originalLocationName : locationNames) {

            Optional<LocationCoordinatesEntity> geocoded = getOrCreateCoordinates(originalLocationName);

            if (geocoded.isEmpty()) {
                log.warn("Skipping location because geocoding failed: {}",originalLocationName);
                sleepBetweenRequests();
                continue;
            }

            LocationCoordinatesEntity geocodedLocation = geocoded.get();

            Optional<LocationCoordinatesEntity> existing =
                    locationRepository.findByLocationName(
                            originalLocationName
                    );

            LocationCoordinatesEntity location;

            if (existing.isPresent()) {

                location = existing.get();
                location.setLatitude(geocodedLocation.getLatitude());
                location.setLongitude(geocodedLocation.getLongitude());
                location.setCountry(geocodedLocation.getCountry());
                location.setCountryCode(geocodedLocation.getCountryCode());

                log.info("Updating existing location: {}",originalLocationName);

            } else {
                location = geocodedLocation;
                log.info("Creating new location: {}",originalLocationName);
            }

            try {

                locationRepository.save(location);

                if (Objects.equals(originalLocationName,"UN Headquarters")
                        || Objects.equals(originalLocationName,"United Nations headquarters")) {

                    graphDataRepository.updateUnitedNationsCoordinates(
                            location.getLatitude(),
                            location.getLongitude(),
                            location.getCountry(),
                            location.getCountryCode()
                    );

                } else {
                    graphDataRepository.updateCoordinates(
                            originalLocationName,
                            location.getLatitude(),
                            location.getLongitude(),
                            location.getCountry(),
                            location.getCountryCode()
                    );
                }

                log.info(
                        "Successfully synchronized location: {} -> {}, {} ({})",
                        originalLocationName,
                        location.getLatitude(),
                        location.getLongitude(),
                        location.getCountryCode()
                );

            } catch (Exception e) {

                log.error(
                        "Failed to save/update location: {}",
                        originalLocationName,
                        e
                );
            }

            sleepBetweenRequests();
        }

        log.info("Location synchronization finished.");
    }

    private void sleepBetweenRequests() {
        try {
            Thread.sleep(2500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Location synchronization interrupted.");
        }
    }

    public List<String> getAllLocationEntity() {
        Optional<Long> foundId = entityTypeRepository.findIdByName("location");
        if (foundId.isPresent()) {
            Long entityTypeId = foundId.get();
            return entityRepository.findValuesByEntityTypeId(entityTypeId);
        }
        return new ArrayList<>();
    }

    private Optional<LocationCoordinatesEntity> getOrCreateCoordinates(
            String originalLocationName) {

        if (originalLocationName == null || originalLocationName.trim().isEmpty()) {
            return Optional.empty();
        }

        String tempLocationName =originalLocationName;

        String formattedLocationName = originalLocationName.trim().toLowerCase();

        String searchLocationName = originalLocationName;

        switch (formattedLocationName) {
            case "un headquarters":
            case "united nations headquarters":
                searchLocationName = "United Nations Headquarters";
                break;
        }

        return fetchFromExternalGeocodingApi(searchLocationName,tempLocationName);
    }


    private Optional<LocationCoordinatesEntity>
    fetchFromExternalGeocodingApi(
            String searchLocationName,
            String originalLocationName) {

        try {

            String url = "https://nominatim.openstreetmap.org/search?q="+ URLEncoder.encode(searchLocationName,StandardCharsets.UTF_8)
                            + "&format=json"
                            + "&limit=1"
                            + "&addressdetails=1";

            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.USER_AGENT,"MyNewsAnalyticsApp/1.0 (contact: cuongpham@gmail.com)");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            var response = restTemplate.exchange(url,HttpMethod.GET,entity,JsonNode.class);
            JsonNode body = response.getBody();

            if (body == null|| !body.isArray() || body.isEmpty()) {
                log.warn("No geocoding result for: {}",searchLocationName);

                return Optional.empty();
            }

            JsonNode firstMatch = body.get(0);
            JsonNode latNode = firstMatch.path("lat");
            JsonNode lonNode = firstMatch.path("lon");

            if (latNode.isMissingNode()
                    || lonNode.isMissingNode()) {

                log.warn(
                        "Geocoding result has no coordinates: {}",
                        searchLocationName
                );

                return Optional.empty();
            }

            double latitude = latNode.asDouble();
            double longitude = lonNode.asDouble();


            JsonNode address = firstMatch.path("address");
            String country = address.path("country").asText("Unknown");
            String countryCode = address.path("country_code").asText("XX").toUpperCase();

            return Optional.of(new LocationCoordinatesEntity(
                            originalLocationName,
                            latitude,
                            longitude,
                            country,
                            countryCode
                    )
            );

        } catch (HttpClientErrorException.TooManyRequests e) {
            log.warn("Nominatim rate limit reached for: {}",searchLocationName);
            return Optional.empty();

        } catch (Exception e) {
            log.error("Failed to fetch geocode for location: {}",searchLocationName,e);
            return Optional.empty();
        }
    }

}

