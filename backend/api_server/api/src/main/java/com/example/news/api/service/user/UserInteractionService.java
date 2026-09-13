package com.example.news.api.service.user;

import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.entity.NewsBookmarkEntity;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.entity.NewsReactionEntity;
import com.example.news.api.repository.news.NewsRepository;
import com.example.news.api.repository.user.UserBookmarkRepository;
import com.example.news.api.repository.user.UserReactionRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserInteractionService {
    private final UserBookmarkRepository userBookmarkRepository;
    private final UserReactionRepository userReactionRepository;
    private final NewsRepository newsRepository;

    public UserInteractionService(
            NewsRepository newsRepository,
            UserBookmarkRepository userBookmarkRepository,
            UserReactionRepository userReactionRepository

    ){
        this.newsRepository = newsRepository;
        this.userBookmarkRepository = userBookmarkRepository;
        this.userReactionRepository = userReactionRepository;
    }

    @Transactional
    public void addJpaBookmark (UUID newsId, String userId){
        if (!userBookmarkRepository.existsByNews_IdAndUserId(newsId, userId)) {
            NewsEntity news = newsRepository.findById(newsId)
                    .orElseThrow(() -> new EntityNotFoundException("News not found"));

            NewsBookmarkEntity bookmark = new NewsBookmarkEntity();
            bookmark.setNews(news);
            bookmark.setUserId(userId);

            userBookmarkRepository.save(bookmark);
        }
    }

    public void removeJpaBookmark(UUID newsId, String userId){
        userBookmarkRepository
                .findByNews_IdAndUserId(newsId,userId)
                .ifPresent(userBookmarkRepository::delete);
    }

    public Long getReactionCount(UUID newsId, ReactionType reactionType){
        return userReactionRepository.countByNews_IdAndType(
                newsId,
                reactionType
        );
    }

    public Optional<NewsReactionEntity> findNewsReaction(UUID newsId, String userId){
        return userReactionRepository.findByNews_IdAndUserId(newsId, userId);
    }

    @Transactional
    public void addJpaReaction(UUID newsId, String userId, ReactionType reactionType){
        NewsEntity news = newsRepository.findById(newsId)
                .orElseThrow(() -> new EntityNotFoundException("News not found"));

        NewsReactionEntity newsReactionEntity = userReactionRepository
                .findByNews_IdAndUserId(newsId, userId)
                .orElseGet(NewsReactionEntity::new);

        newsReactionEntity.setNews(news);
        newsReactionEntity.setUserId(userId);
        newsReactionEntity.setType(reactionType);
        userReactionRepository.save(newsReactionEntity);

    }

    public void removeJpaReaction(NewsReactionEntity newsReactionEntity){
        userReactionRepository.delete(newsReactionEntity);
    }
}
