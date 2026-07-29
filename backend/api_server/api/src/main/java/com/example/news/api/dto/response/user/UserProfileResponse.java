package com.example.news.api.dto.response.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserProfileResponse {
    private String userId;
    private String username ;
    private String email;
    private String firstName;
    private String lastName;
}
