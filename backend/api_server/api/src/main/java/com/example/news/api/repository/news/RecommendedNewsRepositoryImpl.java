package com.example.news.api.repository.news;

import com.example.news.api.dto.internal.SimilarNewsId;
import com.example.news.api.dto.response.news.RecommendedNewsResponse;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public class RecommendedNewsRepositoryImpl implements  RecommendedNewsRepository {
    private final Neo4jClient neo4jClient;

    public RecommendedNewsRepositoryImpl (Neo4jClient neo4jClient){
        this.neo4jClient = neo4jClient;
    }

    @Override
    public List<RecommendedNewsResponse> getVectorRecommendations(String userId, float[] userProfileVector, int limit) {
        return neo4jClient.query("""
            CALL db.index.vector.queryNodes('news_embeddings_idx', $limit, $userProfileVector)
            YIELD node, score
            
            MATCH (u:User {id: $userId})
            WHERE NOT (u)-[:BOOKMARKED]->(node)
                AND NOT (u)-[:REACTED_TO]->(node)
            
            WHERE node.link <> src.link
            RETURN node.link AS link, score AS score
            
            RETURN node.id AS id,
                   node.title AS title,
                   node.summary AS summary,
                   node.language AS language,
                   node.link AS link,
                   node.publish_date AS publishDate,
                   node.sentiment AS sentimentScore,
                   round(score, 2) AS personalizationScore,
                   "Semantically matches your reading history." AS reason
            
            ORDER BY personalizationScore DESC
            """)
                .bind(userId).to("userId")
                .bind(userProfileVector).to("userProfileVector")
                .bind(limit).to("limit")
                .fetch()
                .all()
                .stream()
                .map(record -> {
                    RecommendedNewsResponse response = new RecommendedNewsResponse();
                    response.setId(String.valueOf(record.get("id")));
                    response.setTitle((String) record.get("title"));
                    response.setSummary((String) record.get("summary"));
                    response.setLanguage((String) record.get("language"));
                    response.setLink((String) record.get("link"));
                    response.setPublishDate((String) record.get("publishDate"));

                    Number sentiment = (Number) record.get("sentiment");
                    response.setSentiment(
                            sentiment == null ? 0.0 : sentiment.doubleValue());

                    Number score = (Number) record.get("personalizationScore");
                    response.setPersonalizationScore(
                            score == null ? 0.0 : score.doubleValue());

                    response.setReason((String) record.get("reason"));
                    return response;
                })
                .toList();
    }

    @Override
    public List<float[]> getHistoricalEmbeddingsForUser(String userId) {
        return neo4jClient.query("""
        MATCH (u:User {id: $userId})-[interaction]->(n:News)
        WHERE type(interaction) = 'BOOKMARKED'
           OR (type(interaction) = 'REACTED_TO'
               AND interaction.type = 'LIKE')
        RETURN n.summary_embedding AS embedding
        """)
                .bind(userId).to("userId")
                .fetch()
                .all()
                .stream()
                .map(record -> (float[]) record.get("embedding"))
                .toList();
    }
}
