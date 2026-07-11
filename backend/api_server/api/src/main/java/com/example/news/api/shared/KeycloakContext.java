package com.example.news.api.shared;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

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
    }

    public UserResource getUserResourceById (String userId){
        return keycloak.realm(keycloakRealm)
                .users()
                .get(userId);
    }

    public RealmResource getRealm(){
        return keycloak.realm(keycloakRealm);
    }
}
