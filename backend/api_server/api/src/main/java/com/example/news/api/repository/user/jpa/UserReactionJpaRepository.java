package com.example.news.api.repository.user.jpa;

import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.entity.NewsReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserReactionJpaRepository extends JpaRepository<NewsReactionEntity, Integer> {
    Optional<NewsReactionEntity> findByNews_IdAndUserId(
            int newsId,
            String userId
    );

    long countByNews_IdAndType(
            int newsId,
            ReactionType type
    );

    boolean existsByNews_IdAndUserId(int newsId, String userId);

}