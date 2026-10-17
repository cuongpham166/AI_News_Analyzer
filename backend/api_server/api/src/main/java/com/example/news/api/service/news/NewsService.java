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
import com.example.news.api.repository.news.GraphNewsRepository;
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
    private final GraphNewsRepository graphNewsRepository;
    private final NewsRepository newsRepository;
    private final NewsMapper newsMapper;

    public NewsService(
        NewsRepository newsRepository,
        GraphNewsRepository graphNewsRepository,
        InferenceNewsRepository inferenceNewsRepository,
        NewsMapper newsMapper

    ){
        this.newsRepository = newsRepository;
        this.graphNewsRepository = graphNewsRepository;
        this.inferenceNewsRepository = inferenceNewsRepository;
        this.newsMapper = newsMapper;
    }

    /*public DetailedNewsResponse getDetailedNews(UUID newsId){
        Optional<NewsEntity> news = newsRepository.findById(newsId);
        Optional<InferenceNewsEntity> inferenceNews = inferenceNewsRepository.findByNews_Id(newsId);

        if(news.isPresent() && inferenceNews.isPresent()){
            NewsEntity foundNews = news.get();
            InferenceNewsEntity foundInferenceNews = inferenceNews.get();
            return newsMapper.toDetailedNews(foundNews,foundInferenceNews);
        }
        return new DetailedNewsResponse();
    }

    public DetailedNewsResponse getDetailedNewsByContentHash(String contentHash){
        Optional<NewsEntity> news = newsRepository.findByContentHash(contentHash);

        if(news.isPresent()){
            UUID newsId = news.get().getId();
            Optional<InferenceNewsEntity> inferenceNews = inferenceNewsRepository.findByNews_Id(newsId);
            if(inferenceNews.isPresent()){
                NewsEntity foundNews = news.get();
                InferenceNewsEntity foundInferenceNews = inferenceNews.get();
                return newsMapper.toDetailedNews(foundNews,foundInferenceNews);
            }
        }

        return new DetailedNewsResponse();
    }*/

    private DetailedNewsResponse buildDetailedNews(NewsEntity news) {
        return inferenceNewsRepository.findByNews_Id(news.getId())
                .map(inference -> newsMapper.toDetailedNews(news, inference))
                .orElseGet(DetailedNewsResponse::new);
    }

    public DetailedNewsResponse getDetailedNews(UUID newsId) {
        return newsRepository.findById(newsId)
                .map(this::buildDetailedNews)
                .orElseGet(DetailedNewsResponse::new);
    }

    public DetailedNewsResponse getDetailedNewsByContentHash(String contentHash) {
        return newsRepository.findByContentHash(contentHash)
                .map(this::buildDetailedNews)
                .orElseGet(DetailedNewsResponse::new);
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

    public List<NewsResponse> getNewsByKeyphrase(String keyphrase){
        return graphNewsRepository.getNewsByKeyphrase(keyphrase);
    }

    public List<NewsResponse> getNewsByEvent(String event){
        return graphNewsRepository.getNewsByEvent(event);
    }

    public List<NewsResponse> getNewsByLocation(String location){
        return graphNewsRepository.getNewsByLocation(location);
    }

    public List<NewsResponse> getNewsByOrganization(String organization){
        return graphNewsRepository.getNewsByOrganization(organization);
    }

    public List<NewsResponse> getNewsByPerson(String person){
        return graphNewsRepository.getNewsByPerson(person);
    }

    public List<NewsResponse> getNewsBySource(String source){
        return graphNewsRepository.getNewsBySource(source);
    }

    public List<NewsResponse> getNewsByTopic(String topic){
        return graphNewsRepository.getNewsByTopic(topic);
    }

}
