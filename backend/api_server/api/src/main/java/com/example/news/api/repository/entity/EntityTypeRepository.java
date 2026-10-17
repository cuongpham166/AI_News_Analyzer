package com.example.news.api.repository.entity;


import com.example.news.api.dto.internal.news.entity.EntityTypeCount;
import com.example.news.api.entity.EntityTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntityTypeRepository extends JpaRepository<EntityTypeEntity, Long> {

    @Query("""
        SELECT new com.example.news.api.dto.internal.news.entity.EntityTypeCount(
            et.id,
            et.name,
            COUNT(e.id)
        )
        FROM EntityTypeEntity et
        LEFT JOIN et.entities e
        GROUP BY et.id, et.name
        ORDER BY COUNT(e.id) DESC
    """)
    List<EntityTypeCount> findEntityTypeCounts();

    @Query("""
        SELECT e.id
        FROM EntityTypeEntity e
        WHERE e.name = :name
    """)
    Optional<Long> findIdByName(@Param("name") String name);
}


