package com.example.news.api.repository.user.graph;

import java.util.UUID;

public interface UserBookmarkGraphRepository {
    void syncBookmark(String userId, UUID newsId);
    void removeBookmark(String userId, UUID newsId);
}
