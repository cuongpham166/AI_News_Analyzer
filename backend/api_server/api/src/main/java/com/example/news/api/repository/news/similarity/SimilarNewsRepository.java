package com.example.news.api.repository.news.similarity;

import com.example.news.api.dto.internal.SimilarNewsId;

import java.util.List;

public interface SimilarNewsRepository {
    List<SimilarNewsId> findSimilarNewsIds(String currentArticleLink, int limit);
}
