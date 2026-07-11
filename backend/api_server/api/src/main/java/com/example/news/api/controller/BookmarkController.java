package com.example.news.api.controller;

import com.example.news.api.service.BookmarkService;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/bookmark")
public class BookmarkController {

    private final BookmarkService bookmarkService;

    public BookmarkController (BookmarkService bookmarkService){
        this.bookmarkService = bookmarkService;
    }

    @PostMapping("/{newsId}")
    public void addBookmark(@PathVariable Long newsId, JwtAuthenticationToken authentication) {
        bookmarkService.addBookmark(newsId,authentication);
    }

    @DeleteMapping("/{newsId}")
    public void removeBookmark(@PathVariable Long newsId, JwtAuthenticationToken authentication) {
        bookmarkService.removeBookmark(newsId,authentication);
    }




}
