package com.example.news.api.util.query;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.aggregations.CalendarInterval;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.json.JsonData;
import com.example.news.api.util.etc.AggregationData;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class IndexAnalysisQuery {
    public IndexAnalysisQuery(){}

    public SearchRequest getGlobalTrendsRequest (long startEpoch, long endEpoch, CalendarInterval intervalEnum) throws IOException {
        return SearchRequest.of(s -> s
                .index("news")
                .size(0)
                .query(q -> q
                        .bool(b -> b
                                .filter(f -> f.range(r -> r
                                                .field("publish_date")
                                                .format("epoch_second")
                                                .gte(JsonData.of(startEpoch))
                                                .lte(JsonData.of(endEpoch))
                                        )
                                )
                        )
                )
                .aggregations("trends_over_time", a -> a
                        .dateHistogram(d -> d
                                .field("publish_date")
                                .calendarInterval(intervalEnum)
                        )
                        .aggregations("avg_sentiment", AggregationData.getAvgSentimentAgg())
                        .aggregations("top_topics",AggregationData.getTopicAgg())
                )
        );
    }

    public SearchRequest getGlobalEntitiesTrendsRequest (long startEpoch,long endEpoch, CalendarInterval intervalEnum) throws IOException {
        return SearchRequest.of(s -> s
                .index("news")
                .size(0)
                .query(q -> q
                        .bool(b -> b
                                .filter(f -> f.range(r -> r
                                                .field("publish_date")
                                                .format("epoch_second")
                                                .gte(JsonData.of(startEpoch))
                                                .lte(JsonData.of(endEpoch))
                                        )
                                )
                        )
                )
                .aggregations("trends_entities_over_time", a -> a
                        .dateHistogram(d -> d
                                .field("publish_date")
                                .calendarInterval(intervalEnum)
                        )
                        .aggregations("entities", nested -> nested
                                .nested(n -> n.path("entities"))
                                .aggregations("top_entities", terms -> terms
                                        .terms(t -> t
                                                .field("entities.value.keyword")
                                                .size(5)
                                        )
                                        .aggregations("to_news", reverse -> reverse
                                                .reverseNested(r -> r)
                                                .aggregations("avg_sentiment", avg -> avg
                                                        .avg(av -> av.field("sentiment"))
                                                )
                                        )
                                )
                        )
                )
        );
    }

    public SearchRequest getImpactArticlesRequest (long startEpoch,long endEpoch, int topN, boolean isPositive) throws IOException {
        return SearchRequest.of(s -> s
                .index("news")
                .size(topN)
                .query(q -> q.bool(b -> b
                        .filter(f -> f.range(r -> r
                                .field("publish_date")
                                .format("epoch_second")
                                .gte(JsonData.of(startEpoch))
                                .lte(JsonData.of(endEpoch))
                        ))
                ))
                .sort(so -> so.field(f -> f
                        .field("sentiment")
                        .order(isPositive ? SortOrder.Desc : SortOrder.Asc)
                ))
                .sort(so -> so.field(f -> f.field("publish_date").order(SortOrder.Desc)))
        );
    }

    public SearchRequest getTopicRadarRequest(long startEpoch, long endEpoch) throws IOException{
        return SearchRequest.of(s ->s
                .index("news")
                .size(0)
                .query(q -> q.bool(b -> b
                        .filter(f -> f.range(r -> r
                                .field("publish_date")
                                .format("epoch_second")
                                .gte(JsonData.of(startEpoch))
                                .lte(JsonData.of(endEpoch))
                        ))
                ))
                .aggregations("topic_distribution", a -> a
                        .terms(t -> t
                                .field("topic")
                                .size(10)
                        )
                )
        );
    }
}
