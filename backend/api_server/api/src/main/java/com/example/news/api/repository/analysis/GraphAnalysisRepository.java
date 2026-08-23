package com.example.news.api.repository.analysis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.news.api.dto.internal.DiscoveryLinkRecord;
import com.example.news.api.dto.internal.analysis.GraphLink;
import com.example.news.api.dto.internal.analysis.GraphNode;
import com.example.news.api.dto.internal.event.EventMomentumTimeline;
import com.example.news.api.dto.internal.news.GeopoliticalHotspotTopic;
import com.example.news.api.dto.response.analysis.GraphResponse;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.util.etc.GraphNodeAccumulator;
import org.neo4j.driver.Value;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Repository;

import com.example.news.api.util.etc.IntervalConverter;
import com.example.news.api.util.query.GraphAnalysisQuery;


@Repository
public class GraphAnalysisRepository {
    private final Neo4jClient neo4jClient;
    private final GraphAnalysisQuery graphAnalysisQuery;
    private final IntervalConverter aggInterval;

    public GraphAnalysisRepository(
            Neo4jClient neo4jClient,
            GraphAnalysisQuery graphAnalysisQuery,
            IntervalConverter aggInterval
    ){
        this.neo4jClient = neo4jClient;
        this.graphAnalysisQuery = graphAnalysisQuery;
        this.aggInterval = aggInterval;
    }

    public List<PowerCouplesResponse> getPowerCoupleWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getPowerCouplesQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(PowerCouplesResponse.class)
                .mappedBy((typeSystem, record) -> new PowerCouplesResponse(
                        record.get("person").asString(),
                        record.get("organization").asString(),
                        record.get("strength").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("volatility").isNull() ? 0.0 : record.get("volatility").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<EventTrackerResponse> getEventTrackerWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getEventTrackerQueryNew())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(EventTrackerResponse.class)
                .mappedBy((typeSystem, record) -> new EventTrackerResponse(
                        record.get("event").asString(),
                        record.get("location").asString(),
                        record.get("strength").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("volatility").isNull() ? 0.0 : record.get("volatility").asDouble(),

                        record.get("countryCode").asString(),
                        record.get("country").asString(),
                        record.get("latitude").asDouble(),
                        record.get("longitude").asDouble(),
                        record.get("aliases").asList(Value::asString)
                ))
                .all()
                .stream()
                .toList();
    }

    /*public List<GeopoliticalHotspotResponse> getGeopoliticalHotspotWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getGeopoliticalHotspotQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(GeopoliticalHotspotResponse.class)
                .mappedBy((typeSystem, record) -> new GeopoliticalHotspotResponse(
                        record.get("location").asString(),
                        record.get("topic").asString(),
                        record.get("articleCount").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }*/

    public List<GeopoliticalHotspotResponse> getGeopoliticalHotspotWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getGeopoliticalHotspotQueryNew())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(GeopoliticalHotspotResponse.class)
                .mappedBy((typeSystem, record) -> new GeopoliticalHotspotResponse(
                        record.get("location").asString(),
                        record.get("articleCount").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),

                        record.get("topics").asList(topic ->
                                new GeopoliticalHotspotTopic(
                                        topic.get("name").asString(),
                                        topic.get("articleCount").asInt()
                                )
                        ),

                        record.get("aliases").asList(Value::asString),
                        record.get("latitude").asDouble(),
                        record.get("longitude").asDouble(),
                        record.get("country").asString(),
                        record.get("countryCode").asString()
                ))
                .all()
                .stream()
                .toList();
    }

    public GeopoliticalMetricsResponse getGeopoliticalMetricsWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];
        return neo4jClient.query(graphAnalysisQuery.getGeopoliticalMetricsQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(GeopoliticalMetricsResponse.class)
                .mappedBy((typeSystem, record) -> new GeopoliticalMetricsResponse(
                        record.get("totalArticles").asInt(),
                        record.get("hotspots").asInt(),
                        record.get("countries").asInt(),
                        record.get("avgSentiment").isNull()
                                ? 0.0
                                : record.get("avgSentiment").asDouble()
                ))
                .one()
                .orElse(new GeopoliticalMetricsResponse(
                        0,
                        0,
                        0,
                        0.0
                ));
    }

    public EventTrackerMetricsResponse getEventTrackerMetricsWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];
        return neo4jClient.query(graphAnalysisQuery.getEventTrackerMetricsQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(EventTrackerMetricsResponse.class)
                .mappedBy((typeSystem, record) -> new EventTrackerMetricsResponse(
                        record.get("eventsTracked").asInt(),
                        record.get("totalEventCoverage").asInt(),
                        record.get("avgSentiment").isNull()
                                ? 0.0
                                : record.get("avgSentiment").asDouble()
                ))
                .one()
                .orElse(new EventTrackerMetricsResponse(
                        0,
                        0,
                        0.0
                ));
    }


    public List<NarrativeBridgeResponse> getNarrativeBridgeWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getNarrativeBridgeQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(NarrativeBridgeResponse.class)
                .mappedBy((typeSystem, record) -> new NarrativeBridgeResponse(
                        record.get("person").asString(),
                        record.get("keyPhrase").asString(),
                        record.get("frequency").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("volatility").isNull() ? 0.0 : record.get("volatility").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<PublisherFocusResponse> getPublisherFocusWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getPublisherFocusQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(PublisherFocusResponse.class)
                .mappedBy((typeSystem, record) -> new PublisherFocusResponse(
                        record.get("publisher").asString(),
                        record.get("organization").asString(),
                        record.get("coverageVolume").asInt(),
                        record.get("volatility").isNull() ? 0.0 : record.get("volatility").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<InfluencerNetworkResponse> getInfluencerNetworkWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getInfluencerNetworkQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(InfluencerNetworkResponse.class)
                .mappedBy((typeSystem, record) -> new InfluencerNetworkResponse(
                        record.get("personA").asString(),
                        record.get("personB").asString(),
                        record.get("sharedArticles").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("volatility").isNull() ? 0.0 : record.get("volatility").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<SpatialMapResponse> getSpatialMapWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getSpatialMapQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(SpatialMapResponse.class)
                .mappedBy((typeSystem, record) -> new SpatialMapResponse(
                        record.get("location").asString(),
                        record.get("aliases").asList(Value::asString),
                        record.get("latitude").asDouble(),
                        record.get("longitude").asDouble(),
                        record.get("count").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("country").asString(),
                        record.get("countryCode").asString()
                ))
                .all()
                .stream()
                .toList();
    }
    public List<AllianceNetworkResponse> getAllianceNetworkWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getAllianceNetworkQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(AllianceNetworkResponse.class)
                .mappedBy((typeSystem, record) -> new AllianceNetworkResponse(
                        record.get("orgA").asString(),
                        record.get("orgB").asString(),
                        record.get("sharedArticles").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<SourceCoverageResponse> getMediaBiasWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getMediaBiasQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(SourceCoverageResponse.class)
                .mappedBy((typeSystem, record) -> new SourceCoverageResponse(
                        record.get("source").asString(),
                        record.get("topic").asString(),
                        record.get("volume").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<CrisisAndRiskRadarResponse> getCrisisAndRiskRadarWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getCrisisAndRiskRadarQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(CrisisAndRiskRadarResponse.class)
                .mappedBy((typeSystem, record) -> new CrisisAndRiskRadarResponse(
                        record.get("event").asString(),
                        record.get("organization").asString(),
                        record.get("location").asString(),
                        record.get("frequency").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<TrendingKeywordClusterResponse> getTrendingKeywordClusterWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getTrendingKeywordClusterQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(TrendingKeywordClusterResponse.class)
                .mappedBy((typeSystem, record) -> new TrendingKeywordClusterResponse(
                        record.get("topic").asString(),
                        record.get("keyPhrase").asString(),
                        record.get("coOccurrence").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public GraphResponse getEntitiesGraphWithRelativeInterval(String intervalUnit, int amount) {
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        List<DiscoveryLinkRecord> rawLinks = neo4jClient.query(this.graphAnalysisQuery.getEntitiesGraphQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(DiscoveryLinkRecord.class)
                .mappedBy((typeSystem, record) -> new DiscoveryLinkRecord(
                        record.get("source").asString(),
                        record.get("sourceGroup").asString(),
                        record.get("target").asString(),
                        record.get("targetGroup").asString(),
                        record.get("weight").asDouble(),
                        record.get("sentiment").isNull() ? 0.0 : record.get("sentiment").asDouble()
                ))
                .all()
                .stream()
                .toList();

        Map<String, GraphNodeAccumulator> nodeMap = new HashMap<>();
        List<GraphLink> links = new ArrayList<>();

        for (DiscoveryLinkRecord link : rawLinks) {
            nodeMap.putIfAbsent(link.source(), new GraphNodeAccumulator(link.source(), link.sourceGroup()));
            nodeMap.get(link.source()).addConnection(link.weight(), link.sentiment());

            nodeMap.putIfAbsent(link.target(), new GraphNodeAccumulator(link.target(), link.targetGroup()));
            nodeMap.get(link.target()).addConnection(link.weight(), link.sentiment());

            links.add(new GraphLink(link.source(), link.target(), link.weight(), link.sentiment()));
        }

        List<GraphNode> nodes = nodeMap.values().stream()
                .map(GraphNodeAccumulator::build)
                .toList();

        return new GraphResponse(nodes, links);
    }

    public List<CoOccurrenceCellResponse> getEntityCoOccurrenceMatrixWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getEntityCoOccurrenceMatrixQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(CoOccurrenceCellResponse.class)
                .mappedBy((typeSystem, record) -> new CoOccurrenceCellResponse(
                        record.get("entityA").asString(),
                        record.get("typeA").asString(),
                        record.get("entityB").asString(),
                        record.get("typeB").asString(),
                        record.get("sharedCount").asLong(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<EntityPolarizationResponse> getEntityPolarizationWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getEntityPolarizationQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(EntityPolarizationResponse.class)
                .mappedBy((typeSystem, record) -> new EntityPolarizationResponse(
                        record.get("entity").asString(),
                        record.get("entityGroup").asString(),
                        record.get("totalArticles").asLong(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("polarizationScore").isNull() ? 0.0 : record.get("polarizationScore").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<CountryRiskResponse> getCountryRiskWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getCountryRiskQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(CountryRiskResponse.class)
                .mappedBy((typeSystem, record) -> new CountryRiskResponse(
                        record.get("country").asString(),
                        record.get("countryCode").asString(),
                        record.get("articleCount").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("coveragePercent").isNull() ? 0.0 : record.get("coveragePercent").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }


    public List<EventRiskRadarResponse> getEventRiskRadarWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getEventRiskRadarQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(EventRiskRadarResponse.class)
                .mappedBy((typeSystem, record) -> new EventRiskRadarResponse(
                        record.get("event").asString(),
                        record.get("frequency").asInt(),
                        record.get("avgSentiment").isNull() ? 0.0 : record.get("avgSentiment").asDouble(),
                        record.get("volatility").isNull() ? 0.0 : record.get("volatility").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<EventMomentumResponse> getEventMomentumWithRelativeInterval (String intervalUnit, int amount){
        long[] rangeResult = this.aggInterval.computeEpochRangeRelativeForNeo4j(intervalUnit, amount);
        long startEpoch = rangeResult[0];
        long endEpoch = rangeResult[1];

        return neo4jClient.query(graphAnalysisQuery.getEventMomentumQuery())
                .bind(startEpoch).to("startEpoch")
                .bind(endEpoch).to("endEpoch")
                .fetchAs(EventMomentumResponse.class)
                .mappedBy((typeSystem, record) -> new EventMomentumResponse(
                        record.get("event").asString(),
                        record.get("timeline").asList(timeline ->
                                new EventMomentumTimeline(
                                        timeline.get("date").asString(),
                                        timeline.get("volume").asInt()
                                )
                        ),
                        record.get("totalVolume").asInt()
                ))
                .all()
                .stream()
                .toList();
    }
}
