package com.example.news.api.service.admin.metrics.pipeline.provider;

import com.example.news.api.dto.internal.admin.metrics.pipeline.PostgresPipelineMetrics;
import com.example.news.api.repository.entity.EntityRepository;
import com.example.news.api.repository.entity.EntityTypeRepository;
import com.example.news.api.repository.news.*;
import org.springframework.stereotype.Component;

@Component
public class PostgresPipelineMetricsProvider {
    private final NewsRepository newsRepository;
    private final InferenceNewsRepository inferenceNewsRepository;
    private final EntityRepository entityRepository;
    private final EntityTypeRepository entityTypeRepository;
    private final KeyphraseRepository keyphraseRepository;
    private final RssSourceRepository rssSourceRepository;
    private final TopicRepository topicRepository;
    private final SourceRepository sourceRepository;

    public PostgresPipelineMetricsProvider(
            NewsRepository newsRepository,
            InferenceNewsRepository inferenceNewsRepository,
            EntityRepository entityRepository,
            EntityTypeRepository entityTypeRepository,
            KeyphraseRepository keyphraseRepository,
            RssSourceRepository rssSourceRepository,
            TopicRepository topicRepository,
            SourceRepository sourceRepository
    ){
        this.newsRepository = newsRepository;
        this.inferenceNewsRepository = inferenceNewsRepository;
        this.entityRepository = entityRepository;
        this.entityTypeRepository = entityTypeRepository;
        this.keyphraseRepository = keyphraseRepository;
        this.rssSourceRepository = rssSourceRepository;
        this.topicRepository = topicRepository;
        this.sourceRepository = sourceRepository;
    }

    public PostgresPipelineMetrics getPostgresPipelineMetrics(){
        return new PostgresPipelineMetrics(
                newsRepository.count(),
                inferenceNewsRepository.count(),
                entityRepository.count(),
                entityTypeRepository.count(),
                keyphraseRepository.count(),
                rssSourceRepository.count(),
                topicRepository.count(),
                sourceRepository.count(),
                null
        );
    }
}
