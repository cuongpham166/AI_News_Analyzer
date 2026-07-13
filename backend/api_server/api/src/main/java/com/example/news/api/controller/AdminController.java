package com.example.news.api.controller;


import com.example.news.api.dto.response.admin.AdminEventResponse;
import com.example.news.api.dto.response.user.DetailedUserResponse;
import com.example.news.api.dto.response.admin.UserEventResponse;
import com.example.news.api.service.admin.EventService;
import com.example.news.api.service.admin.RoleService;
import com.example.news.api.service.admin.UserService;
import com.example.news.api.dto.request.user.UserRoleRequest;
import com.example.news.api.dto.request.user.UserSearchRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final EventService eventService;

    public AdminController(
            UserService userService,
            RoleService roleService,
            EventService eventService){
        this.userService = userService;
        this.roleService = roleService;
        this.eventService = eventService;
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
    public List<UserEventResponse> getUserEvents(){
        return eventService.getUserEvents();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events/admin")
    public List<AdminEventResponse> getAdminEvents(){
        return eventService.getAdminEvents();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{userId}/reset-password")
    public void resetUserPassword(String userId){
        userService.resetUserPassword(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/username")
    public List<DetailedUserResponse> searchByUsername (@RequestBody UserSearchRequest userSearchRequest){
        return userService.searchByUsername(userSearchRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/email")
    public List<DetailedUserResponse> searchByEmail (@Valid @RequestBody UserSearchRequest userSearchRequest){
        return userService.searchByEmail(userSearchRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/role")
    public List<DetailedUserResponse> searchByRole (@Valid @RequestBody UserSearchRequest userSearchRequest){
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
