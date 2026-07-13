package com.example.news.api.repository;

import com.example.news.api.dto.internal.ReactionType;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GraphRecommendationRepository extends Neo4jRepository<Void, String> {

    @Query("""
        MERGE (u:User {id: $userId})
        WITH u
        MATCH (n:News {id: $newsId})
        MERGE (u)-[:BOOKMARKED]->(n)
        """)
    void syncBookmark(String userId, int newsId);

    @Query("""
        MATCH (u:User {id: $userId})-[r:BOOKMARKED]->(n:News {id: $newsId})
        DELETE r
        """)
    void removeBookmark(String userId, int newsId);

    @Query("""
        MERGE (u:User {id: $userId})
        WITH u
        MATCH (n:News {id: $newsId})
        MERGE (u)-[r:REACTED_TO]->(n)
        SET r.type = $reactionType
        """)
    void syncReaction(String userId, int newsId, ReactionType reactionType);

    @Query("""
        MATCH (u:User {id: $userId})-[r:REACTED_TO]->(n:News {id: $newsId})
        DELETE r
        """)
    void removeReaction(String userId, int newsId);
}
