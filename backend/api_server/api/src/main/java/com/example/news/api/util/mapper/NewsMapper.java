package com.example.news.api.util.mapper;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.news.api.dto.internal.DetailedEntity;

import com.example.news.api.dto.internal.news.*;
import com.example.news.api.dto.response.news.DetailedNewsResponse;
import com.example.news.api.dto.response.news.NewsResponse;
import com.example.news.api.entity.*;
import org.springframework.stereotype.Component;

@Component
public class NewsMapper {

    private DetailedEntityNews toDetailedEntityNews(EntityEntity entity) {
        return new DetailedEntityNews(
                entity.getId(),
                entity.getValue(),
                new DetailedEntityTypeNews(
                        entity.getEntityType().getId(),
                        entity.getEntityType().getName()
                )
        );
    }

    private DetailedKeyphraseNews toDetailedKeyphraseNews(KeyphraseEntity keyphrase){
        return new DetailedKeyphraseNews(
            keyphrase.getId(),
            keyphrase.getValue()
        );
    }

    private DetailedInferenceNews toInferenceNews(InferenceNewsEntity inferenceNews){
        DetailedInferenceNews detailedInferenceNews = new DetailedInferenceNews();

        DetailedSentimentNews sentimentNews = new DetailedSentimentNews(
                inferenceNews.getSentimentLabel(),
                inferenceNews.getSentiment()
        );

        DetailedTopicNews topicNews = new DetailedTopicNews(
                inferenceNews.getTopic().getId(),
                inferenceNews.getTopic().getName()
        );

        Set<DetailedEntityNews> entities = inferenceNews.getEntities()
                .stream()
                .map(InferenceNewsEntityEntity::getEntities)
                .map(this::toDetailedEntityNews)
                .collect(Collectors.toSet());

        Set<DetailedKeyphraseNews> keyphrases = inferenceNews.getKeyphrases()
                .stream()
                .map(InferenceNewsKeyphraseEntity::getKeyphrase)
                .map(this::toDetailedKeyphraseNews)
                .collect(Collectors.toSet());


        detailedInferenceNews.setSentiment(sentimentNews);
        detailedInferenceNews.setTopic(topicNews);
        detailedInferenceNews.setSummary(inferenceNews.getSummary());
        detailedInferenceNews.setEntities(entities);
        detailedInferenceNews.setKeyphrases(keyphrases);

        return detailedInferenceNews;
    }

    private NewsResponse toNews(NewsEntity newsEntity){
        return new NewsResponse(
                newsEntity.getId(),
                newsEntity.getTitle(),
                newsEntity.getLink(),
                newsEntity.getLang(),
                newsEntity.getPublishDate(),
                new DetailedSourceNews(
                        newsEntity.getSource().getId(),
                        newsEntity.getSource().getName()
                )
        );
    }


    public DetailedNewsResponse toDetailedNews(NewsEntity news, InferenceNewsEntity inferenceNews){
        DetailedInferenceNews detailedInferenceNews = toInferenceNews(inferenceNews);

        DetailedSourceNews detailedSourceNews = new DetailedSourceNews(
                news.getSource().getId(),
                news.getSource().getName()
        );

        return new DetailedNewsResponse(
                news.getId(),
                news.getTitle(),
                news.getPublishDate(),
                news.getLink(),
                news.getLang(),
                news.getFullText(),
                detailedSourceNews,
                detailedInferenceNews
        );
    }

    public List<NewsResponse> toNewsList (List<NewsEntity> foundNewsList){
        return foundNewsList
                .stream()
                .map(this::toNews)
                .toList();
    }


}
