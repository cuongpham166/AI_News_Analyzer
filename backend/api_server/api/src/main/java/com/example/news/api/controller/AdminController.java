package com.example.news.api.controller;


import com.example.news.api.dto.response.admin.AdminEventResponse;
import com.example.news.api.dto.response.admin.metrics.PipelineMetricsResponse;
import com.example.news.api.dto.response.user.DetailedUserResponse;
import com.example.news.api.dto.response.admin.UserEventResponse;
import com.example.news.api.service.admin.management.EventService;
import com.example.news.api.service.admin.management.RoleService;
import com.example.news.api.service.admin.management.AdminUserService;
import com.example.news.api.dto.request.user.UserRoleRequest;
import com.example.news.api.dto.request.user.UserSearchRequest;
import com.example.news.api.service.admin.metrics.pipeline.PipelineMetricsService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminUserService adminUserService;
    private final RoleService roleService;
    private final EventService eventService;
    private final PipelineMetricsService pipelineMetricsService;

    public AdminController(
            AdminUserService adminUserService,
            RoleService roleService,
            EventService eventService,
            PipelineMetricsService pipelineMetricsService
    ){
        this.adminUserService = adminUserService;
        this.roleService = roleService;
        this.eventService = eventService;
        this.pipelineMetricsService = pipelineMetricsService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public void getUsers(){}


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/revoke")
    private void revokeUserSession(String userId){
        adminUserService.revokeUserSession(userId);

    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/disable")
    public void disableUser(@PathVariable String userId){
        adminUserService.disableUser(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/enable")
    public void enableUser(@PathVariable String userId){
        adminUserService.enableUser(userId);

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
        adminUserService.resetUserPassword(userId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/username")
    public List<DetailedUserResponse> searchByUsername (@RequestBody UserSearchRequest userSearchRequest){
        return adminUserService.searchByUsername(userSearchRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/email")
    public List<DetailedUserResponse> searchByEmail (@Valid @RequestBody UserSearchRequest userSearchRequest){
        return adminUserService.searchByEmail(userSearchRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/search/role")
    public List<DetailedUserResponse> searchByRole (@Valid @RequestBody UserSearchRequest userSearchRequest){
        return adminUserService.searchByRole(userSearchRequest);
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
