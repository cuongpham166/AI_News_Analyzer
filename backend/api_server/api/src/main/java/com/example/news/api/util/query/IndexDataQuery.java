package com.example.news.api.util.query;

import co.elastic.clients.elasticsearch.core.GetRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
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
}
