package com.example.news.api.repository.topic;

import com.example.news.api.dto.internal.topic.TopicNewsCount;
import com.example.news.api.entity.TopicEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<TopicEntity, Long> {
    @Query("""
        SELECT new com.example.news.api.dto.internal.topic.TopicNewsCount(
            t.id,
            t.name,
            COUNT(t.id)
        )
        FROM TopicEntity t
        LEFT JOIN InferenceNewsEntity n ON n.topic = t
        GROUP BY t.id, t.name
        ORDER BY COUNT(t.id) DESC
    """)
    List<TopicNewsCount> findTopicNewsCounts();
}
