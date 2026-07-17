package com.example.news.api.repository.user.graph;

public interface UserBookmarkGraphRepository {
    void syncBookmark(String userId, int newsId);
    void removeBookmark(String userId, int newsId);
}
