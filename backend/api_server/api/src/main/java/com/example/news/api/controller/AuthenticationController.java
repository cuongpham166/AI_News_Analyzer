package com.example.news.api.controller;

import com.example.news.api.dto.request.auth.UserRegistrationRequest;
import com.example.news.api.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService){
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register")
    private void register(@Valid @RequestBody UserRegistrationRequest newUser){
        authenticationService.register(newUser);
    }


}
