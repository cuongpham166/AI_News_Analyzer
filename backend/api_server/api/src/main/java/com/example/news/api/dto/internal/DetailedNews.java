package com.example.news.api.dto.internal;

import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DetailedNews {
    private int id;
    private String title;
    private Timestamp publishDate;
    private String link;
    private String language;
    private String fullText;
    private String summary;
    private String sentimentLabel;
    private BigDecimal sentiment;
    private Integer topicId;
    private Integer sourceId;
    private String topic_name;
    private String source_name;
    private List<DetailedEntity> entities = new ArrayList<>();

}
