package com.example.news.api.service.news;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.news.api.dto.internal.SimilarNewsId;
import com.example.news.api.dto.response.news.SimilarNewsResponse;
import com.example.news.api.repository.news.SimilarNewsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SimilarNewsService {

    private final ElasticsearchClient elasticsearchClient;
    private final SimilarNewsRepository similarNewsRepository;
    public SimilarNewsService(
            ElasticsearchClient elasticsearchClient,
            SimilarNewsRepository similarNewsRepository
    ){
        this.elasticsearchClient = elasticsearchClient;
        this.similarNewsRepository = similarNewsRepository;
    }

    public List<SimilarNewsResponse> getSimilarNews(String currentArticleLink, int limit) {
        List<SimilarNewsId> similarNewsIds = similarNewsRepository.findSimilarNewsIds(currentArticleLink,limit);
        if (similarNewsIds.isEmpty()) return List.of();

        List<String> targetLinks = similarNewsIds.stream()
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

            Map<String, Double> scoreMap = similarNewsIds.stream()
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
