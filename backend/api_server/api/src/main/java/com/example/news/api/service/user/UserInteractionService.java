package com.example.news.api.service.user;

import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.entity.NewsBookmarkEntity;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.entity.NewsReactionEntity;
import com.example.news.api.repository.news.NewsRepository;
import com.example.news.api.repository.user.graph.UserBookmarkGraphRepository;
import com.example.news.api.repository.user.graph.UserReactionGraphRepository;
import com.example.news.api.repository.user.jpa.UserBookmarkJpaRepository;
import com.example.news.api.repository.user.jpa.UserReactionJpaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserInteractionService {
    private final UserBookmarkGraphRepository userBookmarkGraphRepository;
    private final UserBookmarkJpaRepository userBookmarkJpaRepository;
    private final UserReactionGraphRepository userReactionGraphRepository;
    private final UserReactionJpaRepository userReactionJpaRepository;
    private final NewsRepository newsRepository;

    public UserInteractionService(
            NewsRepository newsRepository,
            UserBookmarkGraphRepository userBookmarkGraphRepository,
            UserBookmarkJpaRepository userBookmarkJpaRepository,
            UserReactionGraphRepository userReactionGraphRepository,
            UserReactionJpaRepository userReactionJpaRepository

    ){
        this.newsRepository = newsRepository;
        this.userBookmarkGraphRepository = userBookmarkGraphRepository;
        this.userBookmarkJpaRepository = userBookmarkJpaRepository;
        this.userReactionGraphRepository = userReactionGraphRepository;
        this.userReactionJpaRepository = userReactionJpaRepository;
    }

    @Transactional
    public void addJpaBookmark (int newsId, String userId){
        if (!userBookmarkJpaRepository.existsByNews_IdAndUserId(newsId, userId)) {
            NewsEntity news = newsRepository.findById(newsId)
                    .orElseThrow(() -> new EntityNotFoundException("News not found"));

            NewsBookmarkEntity bookmark = new NewsBookmarkEntity();
            bookmark.setNews(news);
            bookmark.setUserId(userId);

            userBookmarkJpaRepository.save(bookmark);
        }
    }

    public void addGraphBookmark(String userId, int newsId) {
        userBookmarkGraphRepository.syncBookmark(userId, newsId);
    }

    public void removeJpaBookmark(int newsId, String userId){
        userBookmarkJpaRepository
                .findByNews_IdAndUserId(newsId,userId)
                .ifPresent(userBookmarkJpaRepository::delete);
    }

    public void removeGraphBookmark(String userId, int newsId){
        userBookmarkGraphRepository.removeBookmark(userId,newsId);
    }

    public Long getReactionCount(int newsId, ReactionType reactionType){
        return userReactionJpaRepository.countByNews_IdAndType(
                newsId,
                reactionType
        );
    }

    public Optional<NewsReactionEntity> findNewsReaction(int newsId, String userId){
        return userReactionJpaRepository.findByNews_IdAndUserId(newsId, userId);
    }

    @Transactional
    public void addJpaReaction(int newsId, String userId, ReactionType reactionType){
        NewsEntity news = newsRepository.findById(newsId)
                .orElseThrow(() -> new EntityNotFoundException("News not found"));

        NewsReactionEntity newsReactionEntity = userReactionJpaRepository
                .findByNews_IdAndUserId(newsId, userId)
                .orElseGet(NewsReactionEntity::new);

        newsReactionEntity.setNews(news);
        newsReactionEntity.setUserId(userId);
        newsReactionEntity.setType(reactionType);
        userReactionJpaRepository.save(newsReactionEntity);

    }

    public void removeJpaReaction(NewsReactionEntity newsReactionEntity){
        userReactionJpaRepository.delete(newsReactionEntity);
    }

    public void addGraphReaction(String userId, int newsId, ReactionType reactionType){
        userReactionGraphRepository.syncReaction(userId, newsId, reactionType);
    }

    public void removeGraphReaction(String userId, int newsId){
        userReactionGraphRepository.removeReaction(userId, newsId);
    }

}
