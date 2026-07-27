package com.example.news.api.repository;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.GetRequest;
import co.elastic.clients.elasticsearch.core.GetResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.util.query.IndexDataQuery;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class IndexSearchRepository {
    private final ElasticsearchClient esClient;
    private final IndexDataQuery indexDataQuery;

    public IndexSearchRepository(
            ElasticsearchClient esClient,
            IndexDataQuery indexDataQuery
    ){
        this.esClient = esClient;
        this.indexDataQuery = indexDataQuery;
    }

    public InferenceNews getInferenceNewsById(String id) throws IOException {
        GetRequest getRequest = indexDataQuery.getInferenceNewsByIdRequest(id);
        GetResponse<InferenceNews> response = esClient.get(getRequest, InferenceNews.class);
        if (response.found()) {
            return response.source();
        } else {
            return null;
        }
    }

    public List<InferenceNews> getAllInferenceNews() throws IOException {
        List<InferenceNews> allNews = new ArrayList<>();
        SearchRequest searchRequest = indexDataQuery.getAllInferenceNewsRequest();
        SearchResponse<InferenceNews> response = esClient.search(searchRequest, InferenceNews.class);
        for (Hit<InferenceNews> hit : response.hits().hits()) {
            allNews.add(hit.source());
        }
        return allNews;
    }

    public List<InferenceNews> findInterfaceNewsByText (String searchText) throws IOException {
        List<InferenceNews> allNews = new ArrayList<>();
        SearchRequest searchRequest = indexDataQuery.findInterfaceNewsByTextRequest(searchText);
        SearchResponse<InferenceNews> response = esClient.search(searchRequest, InferenceNews.class);
        for (Hit<InferenceNews> hit : response.hits().hits()) {
            allNews.add(hit.source());
        }
        return allNews;
    }
}
