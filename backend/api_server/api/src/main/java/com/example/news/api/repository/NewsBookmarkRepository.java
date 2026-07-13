package com.example.news.api.repository;

import com.example.news.api.entity.NewsBookmarkEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NewsBookmarkRepository extends JpaRepository<NewsBookmarkEntity, Integer>  {
    boolean existsByNews_IdAndUserId(int newsId, String userId);
    Optional<NewsBookmarkEntity> findByNews_IdAndUserId(int newsId, String userId);
}

