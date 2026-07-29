package com.example.news.api.util.mapper;
import java.util.List;
import com.example.news.api.dto.internal.DetailedEntity;

import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.entity.NewsEntity;
import org.springframework.stereotype.Component;

@Component
public class NewsMapper {
    public DetailedNewsResponse toDTO(NewsEntity entity) {
        DetailedNewsResponse dto = new DetailedNewsResponse();

        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setPublishDate(entity.getPublishDate());
        dto.setLink(entity.getLink());
        dto.setLanguage(entity.getLang());
        return dto;
    }

    public DetailedNewsResponse toDetailedDTO (NewsEntity entity, List<DetailedEntity> detailedEntity){
        DetailedNewsResponse detailedDTO = new DetailedNewsResponse();

        detailedDTO.setId(entity.getId());
        detailedDTO.setTitle(entity.getTitle());
        detailedDTO.setPublishDate(entity.getPublishDate());
        detailedDTO.setLink(entity.getLink());
        detailedDTO.setLanguage(entity.getLang());
        detailedDTO.setFullText(entity.getFullText());
        return detailedDTO;
    }
}
