package com.example.news.api.repository.news;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.news.api.entity.NewsEntity;

@Repository
public interface NewsRepository extends JpaRepository<NewsEntity, UUID> {
    Optional<NewsEntity> findById(UUID id);
    List<NewsEntity> findAllBySourceId(int sourceId, Pageable pageable);



}
