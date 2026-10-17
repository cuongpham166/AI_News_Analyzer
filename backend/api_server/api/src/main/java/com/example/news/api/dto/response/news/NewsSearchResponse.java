package com.example.news.api.dto.response.news;

import com.example.news.api.dto.internal.Entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class NewsSearchResponse {
    private String id;
    private String title;
    private String summary;
    private String source;
    private String link;

    @JsonProperty("publish_date")
    private Long publishDate;

    private Double sentiment;

    @JsonProperty("sentiment_label")
    private String sentimentLabel;

    private String topic;

    private List<Entity> entities;

    private Map<String, List<String>> highlights;
}
