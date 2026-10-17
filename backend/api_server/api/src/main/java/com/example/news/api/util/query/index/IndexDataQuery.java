package com.example.news.api.util.query.index;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch.core.GetRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.search.HighlightField;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class IndexDataQuery {

    public IndexDataQuery(){}

    public SearchRequest searchNews(String searchText, int page, int size) {
        return SearchRequest.of(s -> s
                .index("news")
                .from(page * size)
                .size(size)
                .query(q -> q
                        .multiMatch(mm -> mm
                                .query(searchText)
                                .fields(
                                        "title^4",
                                        "summary^2",
                                        "full_text"
                                )
                                .fuzziness("AUTO")
                                .type(TextQueryType.BestFields)
                        )
                )
                .highlight(h -> h
                        .fields("title", HighlightField.of(f -> f))
                        .fields("summary", HighlightField.of(f -> f))
                        .fields("full_text", HighlightField.of(f -> f))
                )
        );
    }

    public SearchRequest searchEntities(String searchText, int page, int size) {
        return SearchRequest.of(s -> s
                .index("news")
                .from(page * size)
                .size(size)
                .query(q -> q
                        .nested(n -> n
                                .path("entities")
                                .query(nq -> nq
                                        .match(m -> m
                                                .field("entities.value")
                                                .query(searchText)
                                                .fuzziness("AUTO")
                                        )
                                )
                        )
                )
                .highlight(h -> h
                        .fields(
                                "entities.value",
                                HighlightField.of(f -> f)
                        )
                )
        );
    }


    public SearchRequest searchSource(String searchText, int page, int size) {
        return SearchRequest.of(s -> s
                .index("news")
                .from(page * size)
                .size(size)
                .query(q -> q
                        .term(t -> t
                                .field("source")
                                .value(searchText)
                        )
                )
                .sort(sort -> sort
                        .field(f -> f
                                .field("publish_date")
                                .order(SortOrder.Desc)
                        )
                )
        );
    }


    private Query newsQuery(String searchText) {
        return Query.of(q -> q
                .multiMatch(mm -> mm
                        .query(searchText)
                        .fields(
                                "title^5",
                                "summary^3",
                                "full_text"
                        )
                        .fuzziness("AUTO")
                )
        );
    }

    private Query sourceQuery(String searchText) {
        return Query.of(q -> q
                .match(m -> m
                        .field("source")
                        .query(searchText)
                        .fuzziness("AUTO")
                )
        );
    }


    private Query entityQuery(String searchText) {
        return Query.of(q -> q
                .nested(n -> n
                        .path("entities")
                        .query(nq -> nq
                                .match(m -> m
                                        .field("entities.value")
                                        .query(searchText)
                                        .fuzziness("AUTO")
                                )
                        )
                )
        );
    }

    public SearchRequest searchEverything(
            String searchText,
            int page,
            int size
    ) {
        return SearchRequest.of(s -> s
                .index("news")
                .from(page * size)
                .size(size)
                .query(q -> q
                        .bool(b -> b
                                .should(
                                        newsQuery(searchText),
                                        sourceQuery(searchText),
                                        entityQuery(searchText)
                                )
                                .minimumShouldMatch("1")
                        )
                )
        );
    }



}
