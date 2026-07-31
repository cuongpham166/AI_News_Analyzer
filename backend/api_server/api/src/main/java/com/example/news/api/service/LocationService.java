package com.example.news.api.service;
import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.entity.EntityEntity;
import com.example.news.api.entity.LocationCoordinatesEntity;
import com.example.news.api.repository.EntityRepository;
import com.example.news.api.repository.EntityTypeRepository;
import com.example.news.api.repository.GraphDataRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.news.api.repository.LocationCoordinatesRepository;
import org.springframework.stereotype.Service;

import org.springframework.http.*;
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

    public void syncLocationCoordinatesEntity(){
        List<String> locationNames = getAllLocationEntity();
        List<LocationCoordinatesEntity> locationCoordinatesList = new ArrayList<>();

        for (String locationName : locationNames) {
            locationCoordinatesList.add(getOrCreateCoordinates(locationName));
            try {
                Thread.sleep(2500); // Wait 2.5 seconds between requests
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        try{
            locationRepository.saveAll(locationCoordinatesList);
            for (LocationCoordinatesEntity locationCoordinate: locationCoordinatesList){
                if(Objects.equals(locationCoordinate.getLocationName(), "UN Headquarters") ||
                    Objects.equals(locationCoordinate.getLocationName(), "United Nations headquarters")
                ){
                    graphDataRepository.updateUnitedNationsCoordinates(
                            locationCoordinate.getLatitude(),
                            locationCoordinate.getLongitude()
                    );
                }else{
                    graphDataRepository.updateCoordinates(
                        locationCoordinate.getLocationName(),
                        locationCoordinate.getLatitude(),
                        locationCoordinate.getLongitude()
                    );
                }
            }
            log.info("Coordinates: {}", locationCoordinatesList);
        }catch (Exception e) {
            log.error("Failed to save location coordinates", e);
        }
    }

    public List<String> getAllLocationEntity(){
        Optional<Long> foundId = entityTypeRepository.findIdByName("location");
        if(foundId.isPresent()){
            Long entityTypeId = foundId.get();
            return entityRepository.findValuesByEntityTypeId(entityTypeId);
        }
        return new ArrayList<>();
    }

    private LocationCoordinatesEntity getOrCreateCoordinates(String locationName) {
        String tempLocationName = locationName;
        String formatedLocationName = locationName.trim().toLowerCase();

        if (locationName.trim().isEmpty()) {
            return new LocationCoordinatesEntity("Unknown", 0.0, 0.0);
        }

        switch (formatedLocationName) {
            case "un headquarters":
            case "united nations headquarters":
                locationName = "United Nations Headquarters";
                break;
        }

        return fetchFromExternalGeocodingApi(locationName,tempLocationName);
    }


    private LocationCoordinatesEntity fetchFromExternalGeocodingApi(String locationName, String tempLocationName) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + URLEncoder.encode(locationName, StandardCharsets.UTF_8)
                    + "&format=json&limit=1";
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Spring-Boot-Analytics-App");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            var response = restTemplate.exchange(url, HttpMethod.GET, entity, JsonNode.class);
            JsonNode body = response.getBody();
            if (body != null && body.isArray() && !body.isEmpty()) {
                JsonNode firstMatch = body.get(0);
                double lat = firstMatch.get("lat").asDouble();
                double lon = firstMatch.get("lon").asDouble();
                if(locationName.equals("United Nations Headquarters")){
                    return new LocationCoordinatesEntity(tempLocationName, lat, lon);
                }
                return new LocationCoordinatesEntity(locationName, lat, lon);
            }
        } catch (Exception e) {
            log.error("Failed to fetch geocode for location: {}", locationName, e);
        }
        return new LocationCoordinatesEntity(locationName, 0.0, 0.0);
    }

}

