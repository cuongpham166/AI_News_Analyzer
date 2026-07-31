package com.example.news.api.repository;

import com.example.news.api.entity.EntityTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EntityTypeRepository extends JpaRepository<EntityTypeEntity, Long> {
    @Query("select e.id from EntityTypeEntity e where e.name = :name")
    Optional<Long> findIdByName(@Param("name") String name);
}
