package com.example.news.api.service;

import java.io.IOException;
import java.util.List;

import com.example.news.api.repository.IndexSearchRepository;
import org.springframework.stereotype.Service;

import com.example.news.api.dto.internal.InferenceNews;

@Service
public class SearchService {
    private final IndexSearchRepository indexSearchRepository;
    
    public SearchService(IndexSearchRepository indexSearchRepository) {
        this.indexSearchRepository = indexSearchRepository;
    }

    public InferenceNews getInferenceNewsById(String id) throws IOException {
        return this.indexSearchRepository.getInferenceNewsById(id);
    }

    public List<InferenceNews> getAllInferenceNews() throws IOException {
        return this.indexSearchRepository.getAllInferenceNews();
    }

    public List<InferenceNews> findInterfaceNewsByText (String searchText) throws IOException {
        return this.indexSearchRepository.findInterfaceNewsByText(searchText);
    }

}
