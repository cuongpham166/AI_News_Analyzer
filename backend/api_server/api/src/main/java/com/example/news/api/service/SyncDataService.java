package com.example.news.api.service;

import com.example.news.api.dto.internal.analytics.EntityAnalytics;
import com.example.news.api.dto.internal.analytics.KeyphraseAnalytics;
import com.example.news.api.dto.response.analytics.NewsAnalytics;
import com.example.news.api.entity.InferenceNewsEntity;
import com.example.news.api.entity.InferenceNewsEntityEntity;
import com.example.news.api.entity.InferenceNewsKeyphraseEntity;
import com.example.news.api.entity.NewsEntity;
import com.example.news.api.repository.analysis.AnalyticsRepository;
import com.example.news.api.repository.news.InferenceNewsRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class SyncDataService {

    private final InferenceNewsRepository inferenceNewsRepo;
    private final AnalyticsRepository analyticsRepo;

    public SyncDataService(
            InferenceNewsRepository inferenceNewsRepo,
            AnalyticsRepository analyticsRepo
    ){
        this.inferenceNewsRepo = inferenceNewsRepo;
        this.analyticsRepo = analyticsRepo;
    }

    public void syncPostgresToClickhouse() {
        List<InferenceNewsEntity> inferenceNewsList = inferenceNewsRepo.findAll();

        List<NewsAnalytics> newsAnalyticsList = new ArrayList<>(
                inferenceNewsList.size()
        );

        for (InferenceNewsEntity inferenceNews : inferenceNewsList) {

            NewsEntity news = inferenceNews.getNews();

            UUID newsAnalyticsId = news.getId();

            long sourceId = news.getSource().getId();
            String sourceName = news.getSource().getName();

            LocalDateTime publishDate = news.getPublishDate().toLocalDateTime();

            String language = news.getLang();
            String contentHash = news.getContentHash();

            float sentiment = inferenceNews.getSentiment().floatValue();

            String sentimentLabel = inferenceNews.getSentimentLabel();

            long topicId = inferenceNews.getTopic().getId();

            String topicName = inferenceNews.getTopic().getName();

            List<EntityAnalytics> entities = inferenceNews.getEntities()
                            .stream()
                            .map(entity -> new EntityAnalytics(
                                    entity.getEntities().getId(),
                                    entity.getEntities().getValue(),
                                    entity.getEntities().getEntityType().getName()
                            ))
                            .toList();

            List<KeyphraseAnalytics> keyphrases =  inferenceNews.getKeyphrases()
                            .stream()
                            .map(phrase -> new KeyphraseAnalytics(
                                    phrase.getKeyphrase().getId(),
                                    phrase.getKeyphrase().getValue()
                            ))
                            .toList();

            newsAnalyticsList.add(new NewsAnalytics(
                    newsAnalyticsId,
                    sourceId,
                    sourceName,
                    publishDate,
                    language,
                    contentHash,
                    sentiment,
                    sentimentLabel,
                    topicId,
                    topicName,
                    entities,
                    keyphrases
            ));
        }
        analyticsRepo.saveAll(newsAnalyticsList);
    }
}
