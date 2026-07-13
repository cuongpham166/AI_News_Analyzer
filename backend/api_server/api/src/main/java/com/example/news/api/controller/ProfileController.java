package com.example.news.api.controller;

import com.example.news.api.dto.response.user.UserProfileResponse;
import com.example.news.api.service.ProfileService;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService){
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public UserProfileResponse getProfile(JwtAuthenticationToken authentication){
        return profileService.getProfile(authentication);
    }

    //Update Profile


}
