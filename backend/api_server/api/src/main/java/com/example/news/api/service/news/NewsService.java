package com.example.news.api.service.news;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.example.news.api.dto.internal.DetailedEntity;
import com.example.news.api.dto.internal.news.DetailedEntityTypeNews;
import com.example.news.api.dto.internal.news.DetailedInferenceNews;
import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.dto.response.news.NewsResponse;
import com.example.news.api.entity.InferenceNewsEntity;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.repository.news.InferenceNewsRepository;
import com.example.news.api.repository.news.NewsRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import com.example.news.api.util.mapper.NewsMapper;

@Service
public class NewsService {
    private final InferenceNewsRepository inferenceNewsRepository;
    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;

    public NewsService(
        NewsRepository newsRepository,
        NewsMapper newsMapper,
        InferenceNewsRepository inferenceNewsRepository
    ){
        this.newsRepository = newsRepository;
        this.inferenceNewsRepository = inferenceNewsRepository;
        this.newsMapper = newsMapper;
    }

    public DetailedNewsResponse getDetailedNews(UUID newsId){
        Optional<NewsEntity> news = newsRepository.findById(newsId);
        Optional<InferenceNewsEntity> inferenceNews = inferenceNewsRepository.findByNews_Id(newsId);

        if(news.isPresent() && inferenceNews.isPresent()){
            NewsEntity foundNews = news.get();
            InferenceNewsEntity foundInferenceNews = inferenceNews.get();
            return newsMapper.toDetailedNews(foundNews,foundInferenceNews);
        }
        return new DetailedNewsResponse();
    }


    public List<NewsResponse> getAllNews(int limit) {
        Pageable pageable = PageRequest.of(
                0,
                limit,
                Sort.by("publishDate").descending()
        );
        List<NewsEntity> foundNewsList = newsRepository.findAll(pageable).getContent();
        return newsMapper.toNewsList(foundNewsList);
    }

    public List<DetailedNewsResponse> getAllNewsBySourceId(int sourceId){
        return new ArrayList<>();
    }

}
