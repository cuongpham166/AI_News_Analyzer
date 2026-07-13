package com.example.news.api.util.auth;

import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KeycloakContext {
    private final Keycloak keycloak;
    private final String keycloakRealm;

    public KeycloakContext(
            Keycloak keycloak,
            @Value("${keycloak.realm}") String keycloakRealm
    ){
        this.keycloak = keycloak;
        this.keycloakRealm = keycloakRealm;
        log.info("KeycloakContext created with realm {}", keycloakRealm);
    }

    public UserResource getUserResourceById (String userId){
        return keycloak.realm(keycloakRealm)
                .users()
                .get(userId);
    }

    public RealmResource getRealm(){
        log.info("getRealm called");
        return keycloak.realm(keycloakRealm);
    }
}
