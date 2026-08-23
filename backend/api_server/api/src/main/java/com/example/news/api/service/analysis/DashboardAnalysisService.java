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
public class DashboardAnalysisService {
    private static final Logger log = LoggerFactory.getLogger(DashboardAnalysisService.class);
    private final GraphAnalysisService graphAnalysisService;
    private final IndexAnalysisService indexAnalysisService;
    private final JpaAnalysisService jpaAnalysisService;
    private final Executor ioExecutor;

    public DashboardAnalysisService(
            GraphAnalysisService graphAnalysisService,
            IndexAnalysisService indexAnalysisService,
            JpaAnalysisService jpaAnalysisService,
            Executor ioExecutor
    ){
        this.graphAnalysisService = graphAnalysisService;
        this.indexAnalysisService = indexAnalysisService;
        this.jpaAnalysisService = jpaAnalysisService;
        this.ioExecutor = ioExecutor;
    }


    public MacroPulseOverviewResponse getMacroPulseOverviewDashboard (){
        MetaDataDistributionResponse metaData = jpaAnalysisService.getMetaDataDistribution();
        MediaPulseOverviewResponse mediaPulse = indexAnalysisService.getMediaPulseOverviewWithRelativeInterval().join();

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
        SentimentVolumeTimelineResponse sentimentVolumeTimeline = indexAnalysisService.getSentimentVolumeTimelineWithRelativeInterval(intervalUnit, amount, calendarInterval).join();
        GlobalTrendsResponse globalTrend = indexAnalysisService.getGlobalTrendsWithRelativeInterval(intervalUnit, amount,calendarInterval).join();
        GlobalEntityTrendsResponse globalEntityTrend = indexAnalysisService.getGlobalEntityWithRelativeInterval(intervalUnit,amount,calendarInterval).join();
        List<EntityVelocityResponse> entityVelocity = indexAnalysisService.getEntityVelocityWithRelativeInterval(intervalUnit, amount).join();
        List<SignificantTermsAggregationResponse> significantTerms = indexAnalysisService.getSignificantTermsAggregationWithRelativeInterval(intervalUnit, amount).join();
        TopRadarResponse topicRadar = indexAnalysisService.getTopicRadarWithRelativeInterval(intervalUnit, amount).join();

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
        List<GeopoliticalHotspotResponse> geoHotspot = graphAnalysisService.getGeopoliticalHotspotWithRelativeInterval(intervalUnit, amount).join();
        GeopoliticalMetricsResponse geoMetrics = graphAnalysisService.getGeopoliticalMetricsWithRelativeInterval(intervalUnit, amount).join();
        List<CountryRiskResponse> countryRisk = graphAnalysisService.getCountryRiskWithRelativeInterval(intervalUnit, amount).join();
        List<SpatialMapResponse> spatialMap = graphAnalysisService.getSpatialMapWithRelativeInterval(intervalUnit, amount).join();
        List<EventTrackerResponse> event = graphAnalysisService.getEventTrackerWithRelativeInterval(intervalUnit,amount).join();
        EventTrackerMetricsResponse eventMetrics = graphAnalysisService.getEventTrackerMetricsWithRelativeInterval(intervalUnit,amount).join();
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
        List<SourceCoverageResponse> sourceCoverage = graphAnalysisService.getMediaBiasWithRelativeInterval(intervalUnit, amount).join();
        List<PublisherFocusResponse> publisherFocus = graphAnalysisService.getPublisherFocusWithRelativeInterval(intervalUnit, amount).join();
        List<EchoChamberResponse> echoChamber = indexAnalysisService.getEchoChamberWithRelativeInterval(intervalUnit, amount).join();
        List<TrendingKeywordClusterResponse> trendingKeyword = graphAnalysisService.getTrendingKeywordClusterWithRelativeInterval(intervalUnit, amount).join();
        return new MediaBiasResponse(
                sourceCoverage,
                publisherFocus,
                echoChamber,
                trendingKeyword
        );
    }

    public NetworkLabResponse getNetworkLabDashboard(String intervalUnit, int amount){
        List<AllianceNetworkResponse> allianceNetwork = graphAnalysisService.getAllianceNetworkWithRelativeInterval(intervalUnit, amount).join();
        List<PowerCouplesResponse> powerCouple = graphAnalysisService.getPowerCoupleWithRelativeInterval(intervalUnit,amount).join();
        List<CoOccurrenceCellResponse> coOccurrenceCell = graphAnalysisService.getEntityCoOccurrenceMatrixWithRelativeInterval(intervalUnit, amount).join();
        List<EntityPolarizationResponse> entityPolarization = graphAnalysisService.getEntityPolarizationWithRelativeInterval(intervalUnit, amount).join();
        List<InfluencerNetworkResponse> influencerNetwork = graphAnalysisService.getInfluencerNetworkWithRelativeInterval(intervalUnit, amount).join();
        List<NarrativeBridgeResponse> narrativeBridge = graphAnalysisService.getNarrativeBridgeWithRelativeInterval(intervalUnit, amount).join();
        List<EventRiskRadarResponse> eventRiskRadar = graphAnalysisService.getEventRiskRadarWithRelativeInterval(intervalUnit, amount).join();
        List<EventMomentumResponse> eventMomentum = graphAnalysisService.getEventMomentumWithRelativeInterval(intervalUnit, amount).join();
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
