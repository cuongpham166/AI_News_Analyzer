package com.example.news.api.service.news;

import com.example.news.api.dto.internal.ReactionType;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.entity.NewsReactionEntity;
import com.example.news.api.repository.NewsReactionRepository;
import com.example.news.api.repository.NewsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class NewsReactionService {
    private final NewsReactionRepository newsReactionRepository;
    private final NewsRepository newsRepository;

    public NewsReactionService(
            NewsReactionRepository newsReactionRepository,
            NewsRepository newsRepository
    ){
        this.newsReactionRepository = newsReactionRepository;
        this.newsRepository = newsRepository;
    }

    public Long getReactionCount(int newsId, ReactionType reactionType){
        return newsReactionRepository.countByNews_IdAndType(
                newsId,
                reactionType
        );
    }

    public Optional<NewsReactionEntity> findNewsReaction(int newsId, String userId){
        return newsReactionRepository.findByNews_IdAndUserId(newsId, userId);
    }

    @Transactional
    public void postReaction(int newsId, String userId, ReactionType reactionType){
        NewsEntity news = newsRepository.findById(newsId)
                .orElseThrow(() -> new EntityNotFoundException("News not found"));

        NewsReactionEntity newsReactionEntity = newsReactionRepository
                .findByNews_IdAndUserId(newsId, userId)
                .orElseGet(NewsReactionEntity::new);

        newsReactionEntity.setNews(news);
        newsReactionEntity.setUserId(userId);
        newsReactionEntity.setType(reactionType);
        newsReactionRepository.save(newsReactionEntity);

    }

    public void removeReaction(NewsReactionEntity newsReactionEntity){
        newsReactionRepository.delete(newsReactionEntity);
    }
}
