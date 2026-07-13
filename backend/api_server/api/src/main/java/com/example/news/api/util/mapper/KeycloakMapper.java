package com.example.news.api.util.mapper;

import com.example.news.api.dto.response.admin.AdminEventResponse;
import com.example.news.api.dto.response.user.DetailedUserResponse;
import com.example.news.api.dto.response.admin.UserEventResponse;
import org.keycloak.representations.idm.AdminEventRepresentation;
import org.keycloak.representations.idm.EventRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Component;

@Component
public class KeycloakMapper {
    public DetailedUserResponse mapToUserDTO(UserRepresentation user) {
        DetailedUserResponse dto = new DetailedUserResponse();
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

    public UserEventResponse mapToUserEventDTO(EventRepresentation event){
        UserEventResponse dto = new UserEventResponse();
        dto.setEventType(event.getType());
        dto.setUserId(event.getUserId());
        dto.setClientId(event.getClientId());
        dto.setIpAddress(event.getIpAddress());
        dto.setTimestamp(event.getTime());
        return dto;
    }

    public AdminEventResponse mapToAdminEventDTO(AdminEventRepresentation adminEvent){
        AdminEventResponse dto = new AdminEventResponse();
        dto.setOperationType(adminEvent.getOperationType());
        dto.setResourceType(adminEvent.getResourceType());
        dto.setResourcePath(adminEvent.getResourcePath());
        dto.setAdminUserId(adminEvent.getAuthDetails().getUserId());
        dto.setTimestamp(adminEvent.getTime());
        return dto;
    }
}
