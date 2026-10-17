package com.example.news.api.repository.search;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.GetRequest;
import co.elastic.clients.elasticsearch.core.GetResponse;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.example.news.api.dto.internal.InferenceNews;
import com.example.news.api.dto.response.news.NewsSearchResponse;
import com.example.news.api.util.query.index.IndexDataQuery;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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


    private List<NewsSearchResponse> mapResponseToSearchResult (SearchResponse<NewsSearchResponse> response){
        List<NewsSearchResponse> searchResults = new ArrayList<>();
        for (Hit<NewsSearchResponse> hit : response.hits().hits()) {
            if (hit.source() != null) {
                hit.source().setId(hit.id());
                hit.source().setHighlights(hit.highlight());

                searchResults.add(hit.source());
            }
        }
        return  searchResults;
    }

    public List<NewsSearchResponse> searchNews(String searchText, int page, int size) throws IOException{
        SearchRequest searchRequest = indexDataQuery.searchNews(searchText, page, size);
        SearchResponse<NewsSearchResponse> response = esClient.search(searchRequest, NewsSearchResponse.class);
        return mapResponseToSearchResult(response);
    }

    public List<NewsSearchResponse> searchEntities(String searchText, int page, int size)  throws IOException {
        SearchRequest searchRequest = indexDataQuery.searchEntities(searchText, page, size);
        SearchResponse<NewsSearchResponse> response = esClient.search(searchRequest, NewsSearchResponse.class);
        return mapResponseToSearchResult(response);
    }

    public List<NewsSearchResponse> searchSource(String searchText, int page, int size)  throws IOException {
        SearchRequest searchRequest = indexDataQuery.searchSource(searchText, page, size);
        SearchResponse<NewsSearchResponse> response = esClient.search(searchRequest, NewsSearchResponse.class);
        return mapResponseToSearchResult(response);
    }

    public List<NewsSearchResponse> searchEverything(String searchText, int page, int size)  throws IOException {
        SearchRequest searchRequest = indexDataQuery.searchEverything(searchText, page, size);
        SearchResponse<NewsSearchResponse> response = esClient.search(searchRequest, NewsSearchResponse.class);
        return mapResponseToSearchResult(response);
    }
}
