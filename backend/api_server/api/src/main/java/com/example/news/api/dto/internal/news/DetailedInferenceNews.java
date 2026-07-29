package com.example.news.api.dto.internal.news;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DetailedInferenceNews {
    private String summary;
    private DetailedSentimentNews sentiment;
    private DetailedTopicNews topic;
    private Set<DetailedKeyphraseNews> keyphrases;
    private Set<DetailedEntityNews> entities;
}
