package com.example.news.api.service;

import com.example.news.api.dto.jpa.UserProfileDTO;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {


    public ProfileService(){

    }


    public UserProfileDTO getProfile(JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();

        String userId = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");

        //getBookmarks by userId
        UserProfileDTO userProfile = new UserProfileDTO();
        userProfile.setUserId(userId);
        userProfile.setUsername(username);
        userProfile.setEmail(email);
        userProfile.setFirstName(firstName);
        userProfile.setLastName(lastName);

        return userProfile;
    }
}
