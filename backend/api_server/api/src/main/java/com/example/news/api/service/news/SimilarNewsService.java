package com.example.news.api.service.news;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.news.api.dto.internal.SimilarNewsId;
import com.example.news.api.dto.response.news.SimilarNewsResponse;
import com.example.news.api.repository.UserInteractionRepository;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SimilarNewsService {

    private final ElasticsearchClient elasticsearchClient;
    private final UserInteractionRepository userInteractionRepository;

    public SimilarNewsService(
            ElasticsearchClient elasticsearchClient,
            UserInteractionRepository userInteractionRepository
    ){
        this.elasticsearchClient = elasticsearchClient;
        this.userInteractionRepository = userInteractionRepository;
    }

    public List<SimilarNewsResponse> getSimilarNews(String currentArticleLink, int limit) {
        List<SimilarNewsId> similarIds = userInteractionRepository.findSimilarNewsIds(currentArticleLink, limit);

        if (similarIds.isEmpty()) return List.of();

        List<String> targetLinks = similarIds.stream()
                .map(SimilarNewsId::link)
                .toList();

        try{
            SearchResponse<SimilarNewsResponse> response = elasticsearchClient.search(s -> s
                    .index("news_index")
                    .query(q -> q
                            .bool(b -> b
                                    .filter(f -> f.terms(t -> t
                                            .field("link")
                                            .terms(v -> v.value
                                                    (targetLinks.stream()
                                                            .map(FieldValue::of)
                                                            .toList()
                                                    )
                                            )
                                    ))
                            )
                    ),
                    SimilarNewsResponse.class
            );

            Map<String, SimilarNewsResponse> docMap = response.hits().hits().stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toMap(
                            SimilarNewsResponse::getLink,
                            Function.identity()
                    ));

            Map<String, Double> scoreMap = similarIds.stream()
                    .collect(Collectors.toMap(
                            SimilarNewsId::link,
                            SimilarNewsId::score
                    ));
            return targetLinks.stream()
                    .map(docMap::get)
                    .filter(Objects::nonNull)
                    .peek(doc -> doc.setSimilarScore(scoreMap.get(doc.getLink())))
                    .toList();

        }catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

}
