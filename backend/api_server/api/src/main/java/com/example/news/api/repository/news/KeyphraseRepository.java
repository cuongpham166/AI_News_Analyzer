package com.example.news.api.repository.news;

import com.example.news.api.entity.KeyphraseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeyphraseRepository extends JpaRepository<KeyphraseEntity, Long> {
}
