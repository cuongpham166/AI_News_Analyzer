package com.example.news.api.service;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class BookmarkService {


    public BookmarkService(){

    }

    public void addBookmark (Long newsId, JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        //bookmarkRepo.addBookmark(newsId, userId);
    }

    public void removeBookmark(Long newsId, JwtAuthenticationToken authentication){
        Jwt jwt = authentication.getToken();
        String userId = jwt.getSubject();
        //bookmarkRepo.removeBookmark(newsId, userId);
    }


}
