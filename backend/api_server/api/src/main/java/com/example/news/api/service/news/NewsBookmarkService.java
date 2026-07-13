package com.example.news.api.service.news;

import com.example.news.api.entity.NewsBookmarkEntity;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.repository.NewsBookmarkRepository;
import com.example.news.api.repository.NewsRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NewsBookmarkService {
    private final NewsBookmarkRepository newsBookmarkRepository;
    private final NewsRepository newsRepository;

    public NewsBookmarkService(
            NewsBookmarkRepository newsBookmarkRepository,
            NewsRepository newsRepository
    ){
        this.newsBookmarkRepository = newsBookmarkRepository;
        this.newsRepository = newsRepository;
    }

    @Transactional
    public void addBookmark (int newsId, String userId){
        if (!newsBookmarkRepository.existsByNews_IdAndUserId(newsId, userId)) {
            NewsEntity news = newsRepository.findById(newsId)
                    .orElseThrow(() -> new EntityNotFoundException("News not found"));

            NewsBookmarkEntity bookmark = new NewsBookmarkEntity();
            bookmark.setNews(news);
            bookmark.setUserId(userId);

            newsBookmarkRepository.save(bookmark);
        }
    }

    public void removeBookmark(int newsId, String userId){
        newsBookmarkRepository
                .findByNews_IdAndUserId(newsId,userId)
                .ifPresent(newsBookmarkRepository::delete);
    }


}
