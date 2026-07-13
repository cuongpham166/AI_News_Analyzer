package com.example.news.api.util.mapper;
import java.util.List;
import com.example.news.api.dto.internal.DetailedEntity;

import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.entity.NewsEntity;
import org.springframework.stereotype.Component;

@Component
public class NewsMapper {
    public com.example.news.api.dto.response.news.DetailedNewsResponse toDTO(NewsEntity entity) {
        com.example.news.api.dto.response.news.DetailedNewsResponse dto = new com.example.news.api.dto.response.news.DetailedNewsResponse();

        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setPublishDate(entity.getPublishDate());
        dto.setLink(entity.getLink());
        dto.setLanguage(entity.getLang());
        dto.setSummary(entity.getSummary());
        dto.setSentimentLabel(entity.getSentimentLabel());
        dto.setSentiment(entity.getSentiment());

        if(entity.getTopic() != null){
            dto.setTopicId(entity.getTopic().getId());
            dto.setTopic_name(entity.getTopic().getName());
        }

        if(entity.getSource() != null){
            dto.setSourceId(entity.getSource().getId());
            dto.setSource_name(entity.getSource().getName());
        }

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
        detailedDTO.setSummary(entity.getSummary());
        detailedDTO.setSentimentLabel(entity.getSentimentLabel());
        detailedDTO.setSentiment(entity.getSentiment());

        if(entity.getTopic() != null){
            detailedDTO.setTopicId(entity.getTopic().getId());
            detailedDTO.setTopic_name(entity.getTopic().getName());
        }

        if(entity.getSource() != null){
            detailedDTO.setSourceId(entity.getSource().getId());
            detailedDTO.setSource_name(entity.getSource().getName());
        }

        detailedDTO.setEntities(detailedEntity);
        return detailedDTO;
    }
}
