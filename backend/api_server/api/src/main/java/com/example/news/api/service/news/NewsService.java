package com.example.news.api.service.news;

import java.util.List;

import com.example.news.api.dto.internal.DetailedEntity;
import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.repository.news.NewsRepository;
import com.example.news.api.repository.analysis.RelationshipRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import com.example.news.api.util.mapper.NewsMapper;

@Service
public class NewsService {
    private final NewsRepository newsRepo;
    private final RelationshipRepository relationshipRepo;
    private final NewsMapper newsMapper;

    public NewsService(
        NewsRepository newsRepo,
        RelationshipRepository relationshipRepo,
        NewsMapper newsMapper
    ){
        this.newsRepo = newsRepo;
        this.relationshipRepo = relationshipRepo;
        this.newsMapper = newsMapper;
    }


    public List<com.example.news.api.dto.response.news.DetailedNewsResponse> getAllNews(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return this.newsRepo.findAllWithRelations(pageable)
            .stream()
            .map(this.newsMapper::toDTO)
            .toList();
    }

    public List<com.example.news.api.dto.response.news.DetailedNewsResponse> getAllNewsBySourceId(int sourceId){
        Pageable pageable = PageRequest.of(
                0, // page index (0 = first page)
                10,
                Sort.by(Sort.Direction.DESC, "publishDate")
        );
        return this.newsRepo.findAllBySourceId(sourceId, pageable)
                .stream()
                .map(this.newsMapper::toDTO)
                .toList();
    }

    public DetailedNewsResponse getDetailedNewsByLink(String link) {
        NewsEntity foundNews = newsRepo.findDetailByLink(link)
                .orElseThrow(() -> new RuntimeException("News not found"));
        // Fetch entities as DTOs (with entityType fully populated)
        List<DetailedEntity> detailedEntity = relationshipRepo.findEntitiesByNewsLink(link);
        return this.newsMapper.toDetailedDTO(foundNews,detailedEntity);
    }
}
