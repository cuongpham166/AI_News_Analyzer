package com.example.news.api.repository.news;

import com.example.news.api.entity.RssSourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RssSourceRepository extends JpaRepository<RssSourceEntity,Long> {
}
