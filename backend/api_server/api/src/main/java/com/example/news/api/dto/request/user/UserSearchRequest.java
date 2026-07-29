package com.example.news.api.dto.request.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserSearchRequest {
    private String value;
    private boolean exact;
}
