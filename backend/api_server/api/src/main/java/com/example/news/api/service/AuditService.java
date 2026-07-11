package com.example.news.api.service;

import com.example.news.api.dto.jpa.AdminEventDTO;
import com.example.news.api.dto.jpa.UserEventDTO;
import com.example.news.api.mapper.KeycloakMapper;
import com.example.news.api.shared.KeycloakContext;
import org.keycloak.representations.idm.AdminEventRepresentation;
import org.keycloak.representations.idm.EventRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {
    private final KeycloakContext context;
    private final KeycloakMapper keycloakMapper;

    public AuditService(KeycloakContext context, KeycloakMapper keycloakMapper){
        this.context = context;
        this.keycloakMapper = keycloakMapper;
    }

    public List<UserEventDTO> getUserEvents(){
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

    public List<AdminEventDTO> getAdminEvents(){
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
