package com.example.news.api.repository.user.graph;

import com.example.news.api.dto.internal.ReactionType;

import java.util.UUID;

public interface UserReactionGraphRepository {
    void syncReaction(String userId, UUID newsId, ReactionType reactionType);
    void removeReaction(String userId, UUID newsId);
}
