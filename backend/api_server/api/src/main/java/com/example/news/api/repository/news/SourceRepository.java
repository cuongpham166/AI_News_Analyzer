package com.example.news.api.repository.news;

import com.example.news.api.dto.internal.news.source.SourceNewsCount;
import com.example.news.api.entity.SourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SourceRepository extends JpaRepository<SourceEntity, Long> {
    @Query("""
        SELECT new com.example.news.api.dto.internal.source.SourceNewsCount(
            s.id,
            s.name,
            COUNT(n.id)
        )
        FROM SourceEntity s
        LEFT JOIN NewsEntity n ON n.source = s
        GROUP BY s.id, s.name
        ORDER BY COUNT(n.id) DESC
    """)
    List<SourceNewsCount> findSourceNewsCounts();
    Optional<SourceEntity> findByName(String name);
}
