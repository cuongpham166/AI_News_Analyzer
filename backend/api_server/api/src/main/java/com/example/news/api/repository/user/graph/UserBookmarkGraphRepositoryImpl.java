package com.example.news.api.repository.user.graph;

import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Repository;

@Repository
public class UserBookmarkGraphRepositoryImpl implements  UserBookmarkGraphRepository{
    private final Neo4jClient neo4jClient;

    public UserBookmarkGraphRepositoryImpl(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    @Override
    public void syncBookmark(String userId, int newsId) {
        neo4jClient.query("""
            MERGE (u:User {id: $userId})
            WITH u
            MATCH (n:News {id: $newsId})
            MERGE (u)-[:BOOKMARKED]->(n)
            """)
                .bind(userId).to("userId")
                .bind(newsId).to("newsId")
                .run();
    }

    @Override
    public void removeBookmark(String userId, int newsId) {
        neo4jClient.query("""
            MATCH (u:User {id: $userId})-[r:BOOKMARKED]->(n:News {id: $newsId})
            DELETE r
            """)
                .bind(userId).to("userId")
                .bind(newsId).to("newsId")
                .run();
    }

}
