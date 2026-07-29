package com.example.news.api.repository.user.graph;

import com.example.news.api.dto.internal.ReactionType;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public class UserReactionGraphRepositoryImpl  implements  UserReactionGraphRepository{
    private final Neo4jClient neo4jClient;

    public UserReactionGraphRepositoryImpl(Neo4jClient neo4jClient){
        this.neo4jClient = neo4jClient;
    }

    @Override
    public void syncReaction(String userId, UUID newsId, ReactionType reactionType) {
        neo4jClient.query("""
            MERGE (u:User {id: $userId})
            WITH u
            MATCH (n:News {id: $newsId})
            MERGE (u)-[r:REACTED_TO]->(n)
            SET r.type = $reactionType
            """)
                .bind(userId).to("userId")
                .bind(newsId).to("newsId")
                .bind(reactionType.name()).to("reactionType")
                .run();
    }

    @Override
    public void removeReaction(String userId, UUID newsId) {
        neo4jClient.query("""
            MATCH (u:User {id: $userId})-[r:REACTED_TO]->(n:News {id: $newsId})
            DELETE r
            """)
                .bind(userId).to("userId")
                .bind(newsId).to("newsId")
                .run();
    }
}
