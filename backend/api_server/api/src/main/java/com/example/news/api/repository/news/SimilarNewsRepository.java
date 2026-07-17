package com.example.news.api.repository.news;

import com.example.news.api.dto.internal.SimilarNewsId;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface SimilarNewsRepository {
    List<SimilarNewsId> findSimilarNewsIds(String currentArticleLink, int limit);
}
