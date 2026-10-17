package com.example.news.api.service;

import java.io.IOException;
import java.util.List;

import com.example.news.api.dto.response.news.NewsSearchResponse;
import com.example.news.api.repository.search.IndexSearchRepository;
import org.springframework.stereotype.Service;

import com.example.news.api.dto.internal.InferenceNews;

@Service
public class SearchService {
    private final IndexSearchRepository indexSearchRepository;
    
    public SearchService(IndexSearchRepository indexSearchRepository) {
        this.indexSearchRepository = indexSearchRepository;
    }

    public List<NewsSearchResponse> searchNews(String searchText, int page, int size) throws IOException{
        return indexSearchRepository.searchNews(searchText, page, size);
    }

    public List<NewsSearchResponse> searchEntities(String searchText, int page, int size) throws IOException{
        return indexSearchRepository.searchEntities(searchText, page, size);
    }

    public List<NewsSearchResponse> searchSource(String searchText, int page, int size) throws IOException{
        return indexSearchRepository.searchSource(searchText, page, size);
    }

    public List<NewsSearchResponse> searchEverything(String searchText, int page, int size) throws IOException{
        return indexSearchRepository.searchEverything(searchText, page, size);
    }

}
