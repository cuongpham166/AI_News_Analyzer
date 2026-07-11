package com.example.news.api.mapper;

import com.example.news.api.dto.jpa.AdminEventDTO;
import com.example.news.api.dto.jpa.UserDTO;
import com.example.news.api.dto.jpa.UserEventDTO;
import org.keycloak.representations.idm.AdminEventRepresentation;
import org.keycloak.representations.idm.EventRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

public class KeycloakMapper {
    public UserDTO mapToUserDTO(UserRepresentation user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setCreatedTimestamp(user.getCreatedTimestamp());
        dto.setUsername(user.getUsername());
        dto.setEnabled(user.isEnabled());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        return dto;
    }

    public UserEventDTO mapToUserEventDTO(EventRepresentation event){
        UserEventDTO dto = new UserEventDTO();
        dto.setEventType(event.getType());
        dto.setUserId(event.getUserId());
        dto.setClientId(event.getClientId());
        dto.setIpAddress(event.getIpAddress());
        dto.setTimestamp(event.getTime());
        return dto;
    }

    public AdminEventDTO mapToAdminEventDTO(AdminEventRepresentation adminEvent){
        AdminEventDTO dto = new AdminEventDTO();
        dto.setOperationType(adminEvent.getOperationType());
        dto.setResourceType(adminEvent.getResourceType());
        dto.setResourcePath(adminEvent.getResourcePath());
        dto.setAdminUserId(adminEvent.getAuthDetails().getUserId());
        dto.setTimestamp(adminEvent.getTime());
        return dto;
    }
}
