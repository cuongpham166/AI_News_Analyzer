package com.example.news.api.dto.response.news;

public class SimilarNewsResponse {
    private String id;
    private String language;
    private String link;
    private String publishDate;
    private String summary;
    private String title;
    private double sentiment;

    private Double similarScore;

    public SimilarNewsResponse() {
    }

    public SimilarNewsResponse(String id, String language, String link, String publishDate, String summary, String title, double sentiment, Double similarScore) {
        this.id = id;
        this.language = language;
        this.link = link;
        this.publishDate = publishDate;
        this.summary = summary;
        this.title = title;
        this.sentiment = sentiment;
        this.similarScore = similarScore;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public double getSentiment() {
        return sentiment;
    }

    public void setSentiment(double sentiment) {
        this.sentiment = sentiment;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(String publishDate) {
        this.publishDate = publishDate;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Double getSimilarScore() {
        return similarScore;
    }

    public void setSimilarScore(Double similarScore) {
        this.similarScore = similarScore;
    }
}
