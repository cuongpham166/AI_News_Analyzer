package com.example.news.api.service.analysis;

import com.example.news.api.dto.response.analysis.jpa.MetaDataDistributionResponse;
import com.example.news.api.repository.entity.EntityTypeRepository;
import com.example.news.api.repository.news.InferenceNewsRepository;
import com.example.news.api.repository.news.NewsRepository;
import com.example.news.api.repository.news.SourceRepository;
import com.example.news.api.repository.news.TopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class JpaService {
    private static final Logger log = LoggerFactory.getLogger(JpaService.class);

    private final NewsRepository newsRepository;
    private final InferenceNewsRepository inferenceNewsRepository;
    private final SourceRepository sourceRepository;
    private final EntityTypeRepository entityTypeRepository;
    private final TopicRepository topicRepository;

    public JpaService(
            NewsRepository newsRepository,
            InferenceNewsRepository inferenceNewsRepository,
            SourceRepository sourceRepository,
            EntityTypeRepository entityTypeRepository,
            TopicRepository topicRepository
    ){
        this.newsRepository = newsRepository;
        this.inferenceNewsRepository = inferenceNewsRepository;
        this.sourceRepository = sourceRepository;
        this.entityTypeRepository = entityTypeRepository;
        this.topicRepository = topicRepository;
    }

    public MetaDataDistributionResponse getMetaDataDistribution(){
        return new MetaDataDistributionResponse(
                newsRepository.count(),
                inferenceNewsRepository.count(),
                sourceRepository.findSourceNewsCounts(),
                entityTypeRepository.findEntityTypeCounts(),
                topicRepository.findTopicNewsCounts()
        );
    }
}
