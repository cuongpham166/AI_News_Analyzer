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

        /*
         * Keep Neo4j's ranking information.
         *
         * Merge function is only defensive protection in case
         * duplicate IDs somehow reach this point.
         */
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

            /*
             * Elasticsearch documents indexed with the same ID
             * can be accessed through hit.id().
             */
            Map<String, SimilarNewsResponse> documentMap =
                    response.hits().hits().stream()
                            .filter(hit -> hit.id() != null)
                            .filter(hit -> hit.source() != null)
                            .collect(Collectors.toMap(
                                    Hit::id,
                                    Hit::source,
                                    (first, second) -> first
                            ));

            /*
             * Elasticsearch does not need to preserve Neo4j's order.
             *
             * targetIds is already ordered by Neo4j ranking.
             */
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
