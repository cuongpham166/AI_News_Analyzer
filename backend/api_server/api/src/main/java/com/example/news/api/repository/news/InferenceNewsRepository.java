package com.example.news.api.repository.news;

import com.example.news.api.entity.InferenceNewsEntity;
import com.example.news.api.entity.NewsEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InferenceNewsRepository extends JpaRepository<InferenceNewsEntity, Long> {

    @EntityGraph(attributePaths = {
            "news",
            "topic",
            "keyphrases",
            "entities"
    })
    Optional<InferenceNewsEntity> findByNews_Id(UUID newsId);

}
