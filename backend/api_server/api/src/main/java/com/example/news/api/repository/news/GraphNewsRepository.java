package com.example.news.api.repository.news;

import com.example.news.api.dto.response.news.NewsResponse;

import java.util.List;

public interface GraphNewsRepository {
    List<NewsResponse> getNewsByKeyphrase(String keyphrase);
    List<NewsResponse> getNewsByEvent(String event);
    List<NewsResponse> getNewsByLocation(String location);
    List<NewsResponse> getNewsByOrganization(String organization);
    List<NewsResponse> getNewsByPerson(String person);
    List<NewsResponse> getNewsBySource(String source);
    List<NewsResponse> getNewsByTopic(String topic);
}
