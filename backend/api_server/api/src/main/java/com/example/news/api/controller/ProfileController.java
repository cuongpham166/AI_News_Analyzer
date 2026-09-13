package com.example.news.api.controller;

import com.example.news.api.dto.response.user.UserProfileResponse;
import com.example.news.api.service.user.UserProfileService;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserProfileService userProfileService;

    public ProfileController(UserProfileService userProfileService){
        this.userProfileService = userProfileService;
    }

    @GetMapping("/me")
    public UserProfileResponse getProfile(JwtAuthenticationToken authentication){
        return userProfileService.getProfile(authentication);
    }

    //Update Profile


}
