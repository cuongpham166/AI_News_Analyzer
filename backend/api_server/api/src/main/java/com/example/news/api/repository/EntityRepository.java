package com.example.news.api.repository;

import com.example.news.api.entity.EntityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EntityRepository extends JpaRepository<EntityEntity, Long> {
    @Query("""
           select e.value
           from EntityEntity e
           where e.entityType.id = :entityTypeId
           """)
    List<String> findValuesByEntityTypeId(@Param("entityTypeId") Long entityTypeId);

}
