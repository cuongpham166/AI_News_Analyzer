package com.example.news.api.repository.entity;


import com.example.news.api.dto.internal.entity.EntityTypeCount;
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
        SELECT new com.example.news.api.dto.internal.entity.EntityTypeCount(
            et.id,
            et.name,
            COUNT(et.id)
        )
        FROM EntityTypeEntity et
        LEFT JOIN EntityEntity e ON e.entityType = et
        GROUP BY et.id, et.name
        ORDER BY COUNT(et.id) DESC
    """)
    List<EntityTypeCount> findEntityTypeCounts();

    @Query("select e.id from EntityTypeEntity e where e.name = :name")
    Optional<Long> findIdByName(@Param("name") String name);
}
