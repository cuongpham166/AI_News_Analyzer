package com.example.news.api.service;

import com.example.news.api.dto.response.user.UserProfileResponse;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {


    public ProfileService(){

    }


    public UserProfileResponse getProfile(JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();

        String userId = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");

        //getBookmarks by userId
        UserProfileResponse userProfile = new UserProfileResponse();
        userProfile.setUserId(userId);
        userProfile.setUsername(username);
        userProfile.setEmail(email);
        userProfile.setFirstName(firstName);
        userProfile.setLastName(lastName);

        return userProfile;
    }
}
