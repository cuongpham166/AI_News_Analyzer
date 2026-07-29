package com.example.news.api.dto.request.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserRoleRequest {
    private String userId;
    private String[] roles;
}
