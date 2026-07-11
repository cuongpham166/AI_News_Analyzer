package com.example.news.api.controller;


import com.example.news.api.service.AuditService;
import com.example.news.api.service.RoleService;
import com.example.news.api.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final AuditService auditService;

    public AdminController(
            UserService userService,
            RoleService roleService,
            AuditService auditService){
        this.userService = userService;
        this.roleService = roleService;
        this.auditService = auditService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public void getUsers(){}


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/revoke")
    private void revokeUserSession(String userId){

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/disable")
    public void disableUser(@PathVariable String userId){
        // 1. Disable login
        // 2. Remove active tokens/sessions

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/enable")
    public void enableUser(@PathVariable String userId){

    }

}
