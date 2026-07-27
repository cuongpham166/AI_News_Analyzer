package com.example.news.api.dto.internal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class InferenceNews {
    @JsonProperty("@timestamp")
    private String timestamp;

    @JsonProperty("sentiment_label")
    private String sentimentLabel;

    private Double sentiment;
    private String topic;
    private List<Entity> entities;
    private String summary;
    private String link;

    @JsonProperty("publish_date")
    private Long publishDate;

    private String title;

    private String source;

    @JsonProperty("full_text")
    private String fullText;

}