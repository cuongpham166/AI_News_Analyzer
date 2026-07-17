package com.example.news.api.repository.user.graph;

import com.example.news.api.dto.internal.ReactionType;

public interface UserReactionGraphRepository {
    void syncReaction(String userId, int newsId, ReactionType reactionType);
    void removeReaction(String userId, int newsId);
}
