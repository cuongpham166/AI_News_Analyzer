package com.example.news.api.util.query;

import co.elastic.clients.elasticsearch.core.GetRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.search.HighlightField;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class IndexDataQuery {

    public IndexDataQuery(){}

    public GetRequest getInferenceNewsByIdRequest(String id) throws IOException {
        return GetRequest.of(g -> g
                .index("news")
                .id(id)
        );
    }

    public SearchRequest getAllInferenceNewsRequest()throws IOException {
        return SearchRequest.of(s -> s
                .index("news")
                .query(q -> q
                        .matchAll(m -> m)
                )
                .size(10)
        );
    }

    public SearchRequest findInterfaceNewsByTextRequest(String searchText) throws IOException {
        return SearchRequest.of(s -> s
                .index("news")
                .query(q -> q
                        .match(t -> t
                                .field("title")
                                .query(searchText)
                        )
                )
        );
    }

    public SearchRequest multiFieldSearchQuery(String searchText) throws  IOException{
        return SearchRequest.of(s -> s
                .index("news")
                .query(q -> q
                        .multiMatch(mm -> mm
                                .query(searchText)
                                .fields("title^3", "summary^2", "full_text^1")
                                .fuzziness("AUTO")
                        )
                )
                .highlight(h -> h
                        .fields("summary", HighlightField.of(f -> f))
                        .fields("full_text", HighlightField.of(f -> f))
                )
        );
    }
}
