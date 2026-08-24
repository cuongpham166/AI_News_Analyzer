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
    public List<SimilarNewsId> findSimilarNewsIds(
            String currentArticleId,
            int limit
    ) {
        int candidateLimit = Math.max(limit * 10, 100);

        return neo4jClient.query("""
            MATCH (src:News {id: $currentArticleId})
    
            CALL db.index.vector.queryNodes(
                'news_summary_embeddings',
                $candidateLimit,
                src.summary_embedding
            )
            YIELD node, score
        
            WHERE node.id <> src.id
                AND score >= 0.80
    
            AND (
                src.content_hash IS NULL
                OR node.content_hash IS NULL
                OR node.content_hash <> src.content_hash
            )
    
            WITH src, node, score AS vectorScore
    
            CALL {
                WITH src, node
    
                RETURN EXISTS {
                    MATCH (src)-[:MENTIONS_EVENT]->(event:Event)
                          <-[:MENTIONS_EVENT]-(node)
                } AS sameEvent
            }
    
            CALL {
                WITH src, node
    
                RETURN EXISTS {
                    MATCH (src)-[:MENTIONS_PERSON]->(person:Person)
                          <-[:MENTIONS_PERSON]-(node)
                } AS samePerson
            }
    
            CALL {
                WITH src, node
    
                RETURN EXISTS {
                    MATCH (src)-[:MENTIONS_ORGANIZATION]->(org:Organization)
                          <-[:MENTIONS_ORGANIZATION]-(node)
                } AS sameOrganization
            }
    
            CALL {
                WITH src, node
    
                RETURN EXISTS {
                    MATCH (src)-[:MENTIONS_LOCATION]->(location:Location)
                          <-[:MENTIONS_LOCATION]-(node)
                } AS sameLocation
            }
    
            CALL {
                WITH src, node
    
                RETURN EXISTS {
                    MATCH (src)-[:COVERS]->(topic:Topic)
                          <-[:COVERS]-(node)
                } AS sameTopic
            }
    
            WITH
                node,
                vectorScore,
    
                CASE
                    WHEN sameEvent THEN 1.0
                    WHEN samePerson THEN 0.7
                    WHEN sameOrganization THEN 0.6
                    WHEN sameLocation THEN 0.3
                    WHEN sameTopic THEN 0.1
                    ELSE 0.0
                END AS graphScore
    
            WITH
                node,
                vectorScore,
                graphScore,
    
                (
                    0.85 * vectorScore +
                    0.15 * graphScore
                ) AS rankingScore
    
            RETURN
                node.id AS id,
                vectorScore,
                rankingScore
    
            ORDER BY rankingScore DESC
            LIMIT $limit
        """)
                .bind(currentArticleId).to("currentArticleId")
                .bind(candidateLimit).to("candidateLimit")
                .bind(limit).to("limit")
                .fetch()
                .all()
                .stream()
                .map(record -> new SimilarNewsId(
                        (String) record.get("id"),
                        ((Number) record.get("vectorScore")).doubleValue(),
                        ((Number) record.get("rankingScore")).doubleValue()
                ))
                .toList();
    }
}
