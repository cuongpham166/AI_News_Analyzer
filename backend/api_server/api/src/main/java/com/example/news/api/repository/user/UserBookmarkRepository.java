package com.example.news.api.repository.user;

import com.example.news.api.entity.NewsBookmarkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserBookmarkRepository extends JpaRepository<NewsBookmarkEntity, Long>  {
    boolean existsByNews_IdAndUserId(UUID newsId, String userId);
    Optional<NewsBookmarkEntity> findByNews_IdAndUserId(UUID newsId, String userId);
}