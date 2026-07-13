package com.example.news.api.dto.response.news;

public class RecommendedNewsResponse {
    private String id;
    private String language;
    private String link;
    private String publishDate;
    private String summary;
    private String title;
    private double sentiment;
    private double personalizationScore;
    private String reason;

    public RecommendedNewsResponse() {
    }

    public RecommendedNewsResponse(String id, String language, String link, String publishDate, String summary, String title, double sentiment, double personalizationScore, String reason) {
        this.id = id;
        this.language = language;
        this.link = link;
        this.publishDate = publishDate;
        this.summary = summary;
        this.title = title;
        this.sentiment = sentiment;
        this.personalizationScore = personalizationScore;
        this.reason = reason;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getSentiment() {
        return sentiment;
    }

    public void setSentiment(double sentiment) {
        this.sentiment = sentiment;
    }

    public double getPersonalizationScore() {
        return personalizationScore;
    }

    public void setPersonalizationScore(double personalizationScore) {
        this.personalizationScore = personalizationScore;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
