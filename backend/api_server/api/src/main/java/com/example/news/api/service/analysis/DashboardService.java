package com.example.news.api.service.analysis;

import com.example.news.api.dto.response.analysis.*;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.dto.response.analysis.index.*;
import com.example.news.api.dto.response.analysis.jpa.MetaDataDistributionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.Executor;

@Service
public class DashboardService {
    private static final Logger log = LoggerFactory.getLogger(DashboardService.class);
    private final GraphService graphService;
    private final IndexService indexService;
    private final JpaService jpaService;
    private final Executor ioExecutor;

    public DashboardService(
            GraphService graphService,
            IndexService indexService,
            JpaService jpaService,
            Executor ioExecutor
    ){
        this.graphService = graphService;
        this.indexService = indexService;
        this.jpaService = jpaService;
        this.ioExecutor = ioExecutor;
    }


    public MacroPulseOverviewResponse getMacroPulseOverviewDashboard (){
        MetaDataDistributionResponse metaData = jpaService.getMetaDataDistribution();
        MediaPulseOverviewResponse mediaPulse = indexService.getMediaPulseOverviewWithRelativeInterval().join();

        return new MacroPulseOverviewResponse(
                metaData.getTotalNews(),
                metaData.getTotalInference(),
                metaData.getSourceNewsCounts(),
                metaData.getEntityTypeCounts(),
                metaData.getTopicNewsCounts(),
                mediaPulse.getTotalArticles(),
                mediaPulse.getUniqueStories(),
                mediaPulse.getAmplificationRatio()

        );
    }

    public MacroPulseDetailResponse getMacroPulseDetailDashboard(String intervalUnit, int amount, String calendarInterval){
        SentimentVolumeTimelineResponse sentimentVolumeTimeline = indexService.getSentimentVolumeTimelineWithRelativeInterval(intervalUnit, amount, calendarInterval).join();
        GlobalTrendsResponse globalTrend = indexService.getGlobalTrendsWithRelativeInterval(intervalUnit, amount,calendarInterval).join();
        GlobalEntityTrendsResponse globalEntityTrend = indexService.getGlobalEntityWithRelativeInterval(intervalUnit,amount,calendarInterval).join();
        List<EntityVelocityResponse> entityVelocity = indexService.getEntityVelocityWithRelativeInterval(intervalUnit, amount).join();
        List<SignificantTermsAggregationResponse> significantTerms = indexService.getSignificantTermsAggregationWithRelativeInterval(intervalUnit, amount).join();
        TopRadarResponse topicRadar = indexService.getTopicRadarWithRelativeInterval(intervalUnit, amount).join();

        return new MacroPulseDetailResponse(
                sentimentVolumeTimeline,
                globalTrend,
                globalEntityTrend,
                entityVelocity,
                significantTerms,
                topicRadar
        );
    }

    public RiskMapResponse getRiskMapDashboard(String intervalUnit, int amount){
        List<GeopoliticalHotspotResponse> geoHotspot = graphService.getGeopoliticalHotspotWithRelativeInterval(intervalUnit, amount).join();
        GeopoliticalMetricsResponse geoMetrics = graphService.getGeopoliticalMetricsWithRelativeInterval(intervalUnit, amount).join();
        List<CountryRiskResponse> countryRisk = graphService.getCountryRiskWithRelativeInterval(intervalUnit, amount).join();
        List<SpatialMapResponse> spatialMap = graphService.getSpatialMapWithRelativeInterval(intervalUnit, amount).join();
        List<EventTrackerResponse> event = graphService.getEventTrackerWithRelativeInterval(intervalUnit,amount).join();
        EventTrackerMetricsResponse eventMetrics = graphService.getEventTrackerMetricsWithRelativeInterval(intervalUnit,amount).join();
        //List<CrisisAndRiskRadarResponse> crisis = graphAnalysisService.getCrisisAndRiskRadarWithRelativeInterval(intervalUnit, amount).join();
        return new RiskMapResponse(
                geoHotspot,
                geoMetrics,
                countryRisk,
                spatialMap,
                event,
                eventMetrics
        );
    }

    public MediaBiasResponse getMediaBiasDashboard(String intervalUnit, int amount){
        List<SourceCoverageResponse> sourceCoverage = graphService.getMediaBiasWithRelativeInterval(intervalUnit, amount).join();
        List<PublisherFocusResponse> publisherFocus = graphService.getPublisherFocusWithRelativeInterval(intervalUnit, amount).join();
        List<EchoChamberResponse> echoChamber = indexService.getEchoChamberWithRelativeInterval(intervalUnit, amount).join();
        List<TrendingKeywordClusterResponse> trendingKeyword = graphService.getTrendingKeywordClusterWithRelativeInterval(intervalUnit, amount).join();
        return new MediaBiasResponse(
                sourceCoverage,
                publisherFocus,
                echoChamber,
                trendingKeyword
        );
    }

    public NetworkLabResponse getNetworkLabDashboard(String intervalUnit, int amount){
        List<AllianceNetworkResponse> allianceNetwork = graphService.getAllianceNetworkWithRelativeInterval(intervalUnit, amount).join();
        List<PowerCouplesResponse> powerCouple = graphService.getPowerCoupleWithRelativeInterval(intervalUnit,amount).join();
        List<CoOccurrenceCellResponse> coOccurrenceCell = graphService.getEntityCoOccurrenceMatrixWithRelativeInterval(intervalUnit, amount).join();
        List<EntityPolarizationResponse> entityPolarization = graphService.getEntityPolarizationWithRelativeInterval(intervalUnit, amount).join();
        List<InfluencerNetworkResponse> influencerNetwork = graphService.getInfluencerNetworkWithRelativeInterval(intervalUnit, amount).join();
        List<NarrativeBridgeResponse> narrativeBridge = graphService.getNarrativeBridgeWithRelativeInterval(intervalUnit, amount).join();
        List<EventRiskRadarResponse> eventRiskRadar = graphService.getEventRiskRadarWithRelativeInterval(intervalUnit, amount).join();
        List<EventMomentumResponse> eventMomentum = graphService.getEventMomentumWithRelativeInterval(intervalUnit, amount).join();
        return new NetworkLabResponse(
          allianceNetwork,
          powerCouple,
          coOccurrenceCell,
          entityPolarization,
          influencerNetwork,
          narrativeBridge,
          eventRiskRadar,
          eventMomentum
        );
    }
}
