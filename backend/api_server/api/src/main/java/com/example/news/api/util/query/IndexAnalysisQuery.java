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

    public SearchRequest getEchoChamberRequest(long startEpoch, long endEpoch, int minDocCount) throws IOException{
        return SearchRequest.of(s ->s
                .index("news")
                .size(0)
                .query(q -> q
                        .range(r -> r
                                .field("publish_date")
                                .format("epoch_second")
                                .gte(JsonData.of(startEpoch))
                                .lte(JsonData.of(endEpoch))
                        )
                )
                .aggregations("duplicated_clusters", a -> a
                        .terms(t -> t
                                .field("content_hash")
                                .minDocCount(minDocCount)
                                .size(20)
                        )
                        .aggregations("publishers", sub -> sub
                                .terms(t -> t
                                        .field("source")
                                        .size(10)
                                )
                        )
                        .aggregations("sample_title", sub -> sub
                                .topHits(th -> th
                                        .size(1)
                                        .source(src -> src
                                                .filter(f -> f
                                                        .includes("title")
                                                )
                                        )
                                )
                        )
                )
        );
    }

    public SearchRequest getEntityVelocityRequest(long startEpoch, long endEpoch, long previousStartEpoch) throws IOException {
        return SearchRequest.of(s -> s
                .index("news")
                .size(0)
                .query(q -> q
                        .range(r -> r
                                .field("publish_date")
                                .format("epoch_second")
                                .gte(JsonData.of(previousStartEpoch))
                                .lte(JsonData.of(endEpoch))
                        )
                )
                .aggregations("entities", a -> a
                        .nested(n -> n.path("entities"))
                        .aggregations("entity_names", entityNames -> entityNames
                                .terms(t -> t
                                        .field("entities.value.keyword")
                                        .size(50)
                                )
                                // Step back out to parent document to check root field 'publish_date'
                                .aggregations("to_parent", toParent -> toParent
                                        .reverseNested(rn -> rn)
                                        .aggregations("current_period", current -> current
                                                .filter(f -> f
                                                        .range(r -> r
                                                                .field("publish_date")
                                                                .format("epoch_second")
                                                                .gte(JsonData.of(startEpoch))
                                                                .lte(JsonData.of(endEpoch))
                                                        )
                                                )
                                        )
                                        .aggregations("previous_period", previous -> previous
                                                .filter(f -> f
                                                        .range(r -> r
                                                                .field("publish_date")
                                                                .format("epoch_second")
                                                                .gte(JsonData.of(previousStartEpoch))
                                                                .lt(JsonData.of(startEpoch))
                                                        )
                                                )
                                        )
                                )
                        )
                )
        );
    }

    public SearchRequest getMediaPulseOverviewRequest(long startEpoch, long endEpoch) throws IOException {
        return SearchRequest.of(s -> s
                .index("news")
                .size(0)
                .query(q -> q
                        .range(r -> r
                                .field("publish_date")
                                .format("epoch_second")
                                .gte(JsonData.of(startEpoch))
                                .lte(JsonData.of(endEpoch))
                        )
                )

                .aggregations("total_articles", a -> a
                        .valueCount(vc -> vc.field("link"))
                )

                .aggregations("unique_stories", a -> a
                        .cardinality(c -> c.field("content_hash"))
                )
                .aggregations("nested_entities", a -> a
                        .nested(n -> n.path("entities"))
                        .aggregations("by_entity_type", typeAgg -> typeAgg
                                .terms(t -> t
                                        .field("entities.entity_type")
                                        .size(10)
                                )
                                .aggregations("top_values", valAgg -> valAgg
                                        .terms(t -> t
                                                .field("entities.value.keyword")
                                                .size(15)
                                        )
                                )
                        )
                )

        );
    }

    public SearchRequest getSignificantTermsAggregationRequest(long startEpoch, long endEpoch) throws IOException {
        //Weighted Word Cloud / Tag Cloud: Font size represents the score or doc_count returned by the aggregation.
        return SearchRequest.of(s -> s
                .index("news")
                .size(0)
                .query(q -> q
                        .range(r -> r
                                .field("publish_date")
                                .format("epoch_second")
                                .gte(JsonData.of(startEpoch))
                                .lte(JsonData.of(endEpoch))
                        )
                )
                .aggregations("nested_entities", n -> n
                        .nested(nested -> nested.path("entities"))
                        .aggregations("emerging_buzzwords", eb -> eb
                                .significantTerms(st -> st
                                        .field("entities.value.keyword")
                                        .size(15)
                                        .minDocCount(2L)
                                )
                        )
                )
        );
    }


    public SearchRequest getSentimentVolumeTimelineRequest(long startEpoch, long endEpoch, CalendarInterval calendarInterval) throws IOException {
        //Area Chart with Dual Axes: Plot Article Volume on the left Y-axis and Average Sentiment on the right Y-axis over time.
        //user can change calenderInterval (day, week, month, year)
        return SearchRequest.of(s -> s
                .index("news")
                .size(0)
                .query(q -> q
                        .range(r -> r
                                .field("publish_date")
                                .format("epoch_second")
                                .gte(JsonData.of(startEpoch))
                                .lte(JsonData.of(endEpoch))
                        )
                )

                .aggregations("articles_over_time", n -> n
                        .dateHistogram(d -> d
                                .field("publish_date")
                                .format("epoch_second")
                                .calendarInterval(calendarInterval) //day, week, month, year
                                //.minDocCount(1)
                        )
                        .aggregations("avg_sentiment", as -> as
                                .avg(a -> a.field("sentiment"))
                        )
                        .aggregations("sentiment_breakdown", sb -> sb
                                .terms(t->t.field("sentiment_label"))
                        )
                )
        );
    }



}
