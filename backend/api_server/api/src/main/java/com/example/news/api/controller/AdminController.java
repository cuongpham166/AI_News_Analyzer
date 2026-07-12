package com.example.news.api.controller;


import com.example.news.api.dto.jpa.AdminEventDTO;
import com.example.news.api.dto.jpa.UserDTO;
import com.example.news.api.dto.jpa.UserEventDTO;
import com.example.news.api.service.AuditService;
import com.example.news.api.service.RoleService;
import com.example.news.api.service.UserService;
import com.example.news.api.shared.UserRoleRequest;
import com.example.news.api.shared.UserSearchRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
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
        userService.revokeUserSession(userId);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/disable")
    public void disableUser(@PathVariable String userId){
        userService.disableUser(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/enable")
    public void enableUser(@PathVariable String userId){
        userService.enableUser(userId);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events/users")
    public List<UserEventDTO> getUserEvents(){
        return auditService.getUserEvents();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events/admin")
    public List<AdminEventDTO> getAdminEvents(){
        return auditService.getAdminEvents();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{userId}/reset-password")
    public void resetUserPassword(String userId){
        userService.resetUserPassword(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/username")
    public List<UserDTO> searchByUsername (@RequestBody UserSearchRequest userSearchRequest){
        return userService.searchByUsername(userSearchRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/email")
    public List<UserDTO> searchByEmail (@Valid @RequestBody UserSearchRequest userSearchRequest){
        return userService.searchByEmail(userSearchRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/role")
    public List<UserDTO> searchByRole (@Valid @RequestBody UserSearchRequest userSearchRequest){
        return userService.searchByRole(userSearchRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/discover/realm-roles")
    public List<String> getRealmRoles() {
        return  roleService.getRealmRoles();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/discover/realm-roles/{userId}")
    public List<String> getUserRealmRoles(String userId){
        return roleService.getUserRealmRoles(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/realm-roles/assign")
    public void assignUserRealmRole(@Valid @RequestBody UserRoleRequest userRoleRequest){
        roleService.assignUserRealmRole(userRoleRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/realm-roles/remove")
    public void removeUserRealmRole(@Valid @RequestBody UserRoleRequest userRoleRequest){
        roleService.removeUserRealmRole(userRoleRequest);
    }

}
