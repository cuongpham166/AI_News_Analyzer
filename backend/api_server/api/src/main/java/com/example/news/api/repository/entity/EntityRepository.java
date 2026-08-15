package com.example.news.api.repository.entity;

import com.example.news.api.entity.EntityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EntityRepository extends JpaRepository<EntityEntity, Long> {
    @Query("""
           select e.value
           from EntityEntity e
           where e.entityType.id = :entityTypeId
           """)
    List<String> findValuesByEntityTypeId(@Param("entityTypeId") Long entityTypeId);

    Optional<EntityEntity> findByValue(String value);

}
