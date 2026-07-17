package com.example.news.api.repository.news;

import com.example.news.api.dto.internal.SimilarNewsId;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class SimilarNewsRepositoryImpl implements SimilarNewsRepository{
    private final Neo4jClient neo4jClient;

    public SimilarNewsRepositoryImpl (Neo4jClient neo4jClient){
        this.neo4jClient = neo4jClient;
    }

    @Override
    public List<SimilarNewsId> findSimilarNewsIds(String currentArticleLink, int limit) {
        return neo4jClient.query("""
            MATCH (src:News {link: $currentArticleLink})
            WITH src.summary_embedding AS targetEmbedding, src
            CALL db.index.vector.queryNodes('news_embeddings_idx', $limit, targetEmbedding)
            YIELD node, score
            WHERE node.link <> src.link
            RETURN node.link AS link, score AS score
            ORDER BY score DESC
            """)
                .bind(currentArticleLink).to("currentArticleLink")
                .bind(limit).to("limit")
                .fetch()
                .all()
                .stream()
                .map(record -> new SimilarNewsId(
                        (String) record.get("link"),
                        ((Number) record.get("score")).doubleValue()
                ))
                .toList();

    }
}
