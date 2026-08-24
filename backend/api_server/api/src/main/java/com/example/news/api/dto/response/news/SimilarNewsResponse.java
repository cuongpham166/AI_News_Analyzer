package com.example.news.api.dto.response.news;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class SimilarNewsResponse {
    private String id;

    private String link;

    private String source;

    @JsonProperty("publish_date")
    private String publishDate;

    private String summary;

    private String title;

    private double sentiment;

    @JsonProperty("sentiment_label")
    private String sentimentLabel;

    private Double similarScore; //Semantic similarity between this article and the selected news, based on their content.

    private Double rankingScore; //Overall similarity ranking, combining semantic similarity with related news signals such as topic and entities.
}
