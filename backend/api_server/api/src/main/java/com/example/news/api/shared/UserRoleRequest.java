package com.example.news.api.shared;

public class UserRoleRequest {
    private String userId;
    private String[] roles;

    public UserRoleRequest() {
    }

    public UserRoleRequest(String userId, String[] roles) {
        this.userId = userId;
        this.roles = roles;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String[] getRoles() {
        return roles;
    }

    public void setRoles(String[] roles) {
        this.roles = roles;
    }
}
