package com.example.news.api.service;

import com.example.news.api.dto.jpa.UserDTO;
import com.example.news.api.mapper.KeycloakMapper;
import com.example.news.api.shared.KeycloakContext;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final KeycloakContext context;
    private final KeycloakMapper keycloakMapper;

    public UserService(KeycloakContext context, KeycloakMapper keycloakMapper){
        this.context = context;
        this.keycloakMapper = keycloakMapper;
    }

    public void revokeUserSession(String userId){
        UserResource userResource = this.context.getUserResourceById(userId);
        userResource.logout();
    }

    public void disableUser(String userId){
        UserResource userResource = this.context.getUserResourceById(userId);

        // 1. Disable login
        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(false);
        userResource.update(user);

        // 2. Revoke active session
        revokeUserSession(userId);
    }

    public void enableUser(String userId){
        UserResource userResource  = this.context.getUserResourceById(userId);

        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(true);
        userResource.update(user);

    }

    public List<UserDTO> searchByUsername (String username, boolean exact){
        List<UserRepresentation> users = this.context.getRealm()
                .users()
                .searchByUsername(username,exact);

        return users.stream()
                .map(this.keycloakMapper::mapToUserDTO)
                .toList();
    }

    public List<UserDTO> searchByEmail(String email, boolean exact){
        List<UserRepresentation> users = this.context.getRealm()
                .users()
                .searchByEmail(email,exact);

        return users.stream()
                .map(this.keycloakMapper::mapToUserDTO)
                .toList();
    }

    public List<UserDTO> searchByRole(String roleName){
        List<UserRepresentation> users = this.context.getRealm()
                .roles()
                .get(roleName)
                .getUserMembers();

        return users.stream()
                .map(this.keycloakMapper::mapToUserDTO)
                .toList();
    }

    public void resetUserPassword(String userId){
        revokeUserSession(userId);

        UserResource userResource  = this.context.getUserResourceById(userId);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue("newPassword123");
        credential.setTemporary(true);

        userResource.resetPassword(credential);
    }
}
