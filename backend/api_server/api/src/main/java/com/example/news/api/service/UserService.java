package com.example.news.api.service;

import com.example.news.api.dto.response.user.DetailedUserResponse;
import com.example.news.api.util.mapper.KeycloakMapper;
import com.example.news.api.util.auth.KeycloakContext;
import com.example.news.api.dto.request.user.UserSearchRequest;
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

    public List<DetailedUserResponse> searchByUsername (UserSearchRequest userSearchRequest){
        System.out.println("===== UserService.searchByUsername called =====");
        String username = userSearchRequest.getValue();
        boolean exact = userSearchRequest.isExact();

        List<UserRepresentation> users = this.context.getRealm()
                .users()
                .searchByUsername(username,exact);

        return users.stream()
                .map(this.keycloakMapper::mapToUserDTO)
                .toList();
    }

    public List<DetailedUserResponse> searchByEmail(UserSearchRequest userSearchRequest){
        String email = userSearchRequest.getValue();
        boolean exact = userSearchRequest.isExact();

        List<UserRepresentation> users = this.context.getRealm()
                .users()
                .searchByEmail(email,exact);

        return users.stream()
                .map(this.keycloakMapper::mapToUserDTO)
                .toList();
    }

    public List<DetailedUserResponse> searchByRole(UserSearchRequest userSearchRequest){
        String roleName = userSearchRequest.getValue();

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
