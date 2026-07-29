package com.example.news.api.repository.user.jpa;

import com.example.news.api.entity.NewsBookmarkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserBookmarkJpaRepository extends JpaRepository<NewsBookmarkEntity, Long>  {
    boolean existsByNews_IdAndUserId(UUID newsId, String userId);
    Optional<NewsBookmarkEntity> findByNews_IdAndUserId(UUID newsId, String userId);
}