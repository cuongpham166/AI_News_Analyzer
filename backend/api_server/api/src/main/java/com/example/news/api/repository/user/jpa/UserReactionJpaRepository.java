package com.example.news.api.repository.user.jpa;

import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.entity.NewsReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserReactionJpaRepository extends JpaRepository<NewsReactionEntity, Long> {
    Optional<NewsReactionEntity> findByNews_IdAndUserId(
            UUID newsId,
            String userId
    );

    long countByNews_IdAndType(
            UUID newsId,
            ReactionType type
    );

    boolean existsByNews_IdAndUserId(UUID newsId, String userId);

}