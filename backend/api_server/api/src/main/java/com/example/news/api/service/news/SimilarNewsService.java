package com.example.news.api.service.news;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.news.api.dto.internal.SimilarNewsId;
import com.example.news.api.dto.response.news.SimilarNewsResponse;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.repository.news.NewsRepository;
import com.example.news.api.repository.news.similarity.SimilarNewsRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SimilarNewsService {

    private final ElasticsearchClient elasticsearchClient;
    private final SimilarNewsRepository similarNewsRepository;
    private final NewsRepository newsRepository;

    public SimilarNewsService(
            ElasticsearchClient elasticsearchClient,
            SimilarNewsRepository similarNewsRepository,
            NewsRepository newsRepository
    ){
        this.elasticsearchClient = elasticsearchClient;
        this.similarNewsRepository = similarNewsRepository;
        this.newsRepository = newsRepository;
    }

    public List<SimilarNewsResponse> getSimilarNewsByContentHash(
            String contentHash,
            int limit
    ){
        Optional<NewsEntity> news = newsRepository.findByContentHash(contentHash);
        if(news.isPresent()){
            UUID newsId = news.get().getId();
            return getSimilarNews(newsId.toString(),limit);
        }
        return new ArrayList<>();
    }


    public List<SimilarNewsResponse> getSimilarNews(
            String currentArticleId,
            int limit
    ) {
        List<SimilarNewsId> similarNewsIds =
                similarNewsRepository.findSimilarNewsIds(
                        currentArticleId,
                        limit
                );

        if (similarNewsIds.isEmpty()) {
            return List.of();
        }

        List<String> targetIds = similarNewsIds.stream()
                .map(SimilarNewsId::id)
                .toList();

        Map<String, SimilarNewsId> scoreMap =
                similarNewsIds.stream()
                        .collect(Collectors.toMap(
                                SimilarNewsId::id,
                                Function.identity(),
                                (first, second) -> first
                        ));

        try {
            SearchResponse<SimilarNewsResponse> response =
                    elasticsearchClient.search(s -> s
                                    .index("news")
                                    .size(targetIds.size())

                                    .source(src -> src
                                            .filter(f -> f.includes(
                                                    "language",
                                                    "link",
                                                    "publish_date",
                                                    "summary",
                                                    "title",
                                                    "sentiment",
                                                    "source",
                                                    "sentiment_label"
                                            ))
                                    )

                                    .query(q -> q
                                            .ids(i -> i.values(targetIds))
                                    ),

                            SimilarNewsResponse.class
                    );

            Map<String, SimilarNewsResponse> documentMap =
                    response.hits().hits().stream()
                            .filter(hit -> hit.id() != null)
                            .filter(hit -> hit.source() != null)
                            .collect(Collectors.toMap(
                                    Hit::id,
                                    Hit::source,
                                    (first, second) -> first
                            ));

            return targetIds.stream()
                    .map(id -> {
                        SimilarNewsResponse document =
                                documentMap.get(id);

                        if (document == null) {
                            return null;
                        }

                        SimilarNewsId similarity =
                                scoreMap.get(id);

                        document.setId(id);
                        document.setSimilarScore(
                                similarity.vectorScore()
                        );
                        document.setRankingScore(
                                similarity.rankingScore()
                        );

                        return document;
                    })
                    .filter(Objects::nonNull)
                    .toList();
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

}
