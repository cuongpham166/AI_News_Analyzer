package com.example.news.api.service.admin;

import com.example.news.api.util.auth.KeycloakContext;
import com.example.news.api.dto.request.user.UserRoleRequest;
import jakarta.ws.rs.NotFoundException;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoleService {
    private final KeycloakContext context;

    public RoleService(KeycloakContext context){
        this.context = context;
    }

    public List<String> getRealmRoles() {
        return context.getRealm()
                .roles()
                .list()
                .stream()
                .map(RoleRepresentation::getName)
                .toList();
    }

    public List<String> getUserRealmRoles(String userId){
        UserResource userResource  = context.getUserResourceById(userId);
        return userResource
                .roles()
                .realmLevel()
                .listEffective()
                .stream()
                .map(RoleRepresentation::getName)
                .toList();
    }

    public void assignUserRealmRole(UserRoleRequest userRoleRequest){
        String userId = userRoleRequest.getUserId();
        String[] assignedRealmRoles = userRoleRequest.getRoles();

        UserResource userResource  = context.getUserResourceById(userId);
        List<RoleRepresentation> roles = new ArrayList<>();

        for (String roleName:assignedRealmRoles){
            try{
                RoleRepresentation role = context.getRealm()
                        .roles()
                        .get(roleName)
                        .toRepresentation();
                roles.add(role);
            }catch (NotFoundException e) {
                throw new RuntimeException(
                        "Role not found: " + roleName
                );
            }
        }
        userResource
                .roles()
                .realmLevel()
                .add(roles);
    }

    public void removeUserRealmRole(UserRoleRequest userRoleRequest){
        String userId = userRoleRequest.getUserId();
        String[] removedRoles = userRoleRequest.getRoles();

        UserResource userResource  =  context.getUserResourceById(userId);
        List<RoleRepresentation> roles = new ArrayList<>();

        for (String roleName:removedRoles){
            try{
                RoleRepresentation role = context.getRealm()
                        .roles()
                        .get(roleName)
                        .toRepresentation();
                roles.add(role);
            }catch (NotFoundException e) {
                throw new RuntimeException(
                        "Role not found: " + roleName
                );
            }
        }

        userResource
                .roles()
                .realmLevel()
                .remove(roles);
    }
}
