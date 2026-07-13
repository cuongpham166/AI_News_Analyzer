package com.example.news.api.service.admin;

import com.example.news.api.dto.response.admin.AdminEventResponse;
import com.example.news.api.dto.response.admin.UserEventResponse;
import com.example.news.api.util.mapper.KeycloakMapper;
import com.example.news.api.util.auth.KeycloakContext;
import org.keycloak.representations.idm.AdminEventRepresentation;
import org.keycloak.representations.idm.EventRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    private final KeycloakContext context;
    private final KeycloakMapper keycloakMapper;

    public EventService(KeycloakContext context, KeycloakMapper keycloakMapper){
        this.context = context;
        this.keycloakMapper = keycloakMapper;
    }

    public List<UserEventResponse> getUserEvents(){
        // user activity events
        // Keycloak Event -> UserEventDTO
        List<EventRepresentation> events = context
                .getRealm()
                .getEvents();
        return events
                .stream()
                .map(this.keycloakMapper::mapToUserEventDTO)
                .toList();
    }

    public List<AdminEventResponse> getAdminEvents(){
        // administrator actions
        // Keycloak AdminEventRepresentation -> AdminEventDTO
        List <AdminEventRepresentation> adminEvents = context
                .getRealm()
                .getAdminEvents();
        return adminEvents
                .stream()
                .map(this.keycloakMapper::mapToAdminEventDTO)
                .toList();
    }
}
