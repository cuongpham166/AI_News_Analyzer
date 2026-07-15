package com.example.news.api.repository;

import com.example.news.api.dto.internal.SimilarNewsId;
import com.example.news.api.dto.response.news.RecommendedNewsResponse;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserInteractionRepository extends Neo4jRepository<Void, String> {

    @Query("""
        // 1. Query the vector index using the generated user interest profile
        CALL db.index.vector.queryNodes('news_embeddings_idx', $limit, $userProfileVector) 
        YIELD node, score
        
        // 2. Identify the target user
        MATCH (u:User {id: $userId})
        
        // 3. Prevent recommending articles they have already interacted with or disliked
        WHERE NOT (u)-[:BOOKMARKED]->(node) 
          AND NOT (u)-[:REACTED_TO]->(node)
          
        // 4. Return your explicit schema fields mapped to the DTO
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
    List<RecommendedNewsResponse> getVectorRecommendations(String userId, float[] userProfileVector, int limit);

    /**
     * Helper query to pull the embeddings of articles the user liked or bookmarked
     */
    @Query("""
        MATCH (u:User {id: $userId})-[interaction]->(n:News)
        WHERE type(interaction) = 'BOOKMARKED' 
           OR (type(interaction) = 'REACTED_TO' AND interaction.type = 'LIKE')
        RETURN n.summary_embedding
        """)
    List<float[]> getHistoricalEmbeddingsForUser(String userId);


    @Query("""
        MATCH (src:News {link: $currentArticleLink})
        WITH src.summary_embedding AS targetEmbedding, src
        CALL db.index.vector.queryNodes('news_embeddings_idx', $limit, targetEmbedding)
        YIELD node, score
        WHERE node.link <> src.link
        RETURN node.link AS link, score AS score
        ORDER BY score DESC
        """)
    List<SimilarNewsId> findSimilarNewsIds(String currentArticleLink, int limit);

}
