package com.example.news.api.service;

import com.example.news.api.dto.request.auth.UserRegistrationRequest;
import com.example.news.api.shared.KeycloakContext;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthenticationService {
    private final KeycloakContext context;

    public AuthenticationService(KeycloakContext context) {
        this.context = context;
    }


    private void sendVerificationEmail (String userId){
        UserResource resource = this.context.getRealm()
                .users().get(userId);
        resource.sendVerifyEmail();

        //Realm Settings_Login-Verufy Email = ON =>blocks login until the email is verified.
    }

    public void register(UserRegistrationRequest newUser){
        UserRepresentation user = new UserRepresentation();
        user.setUsername(newUser.getUsername());
        user.setEmail(newUser.getEmail());
        user.setLastName(newUser.getLastname());
        user.setFirstName(newUser.getFirstname());
        user.setEnabled(true);
        user.setEmailVerified(false);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(newUser.getPassword());
        credential.setTemporary(false);

        user.setCredentials(List.of(credential));

        try (Response response = this.context.getRealm()
                .users()
                .create(user)) {

            if (response.getStatus() != 201) {
                throw new RuntimeException("Failed to create user");
            }

            String keycloakUserId = CreatedResponseUtil.getCreatedId(response);
            sendVerificationEmail(keycloakUserId);
        }
    }
    
}
