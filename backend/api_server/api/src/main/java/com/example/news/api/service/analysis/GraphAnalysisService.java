package com.example.news.api.service.analysis;

import com.example.news.api.dto.response.analysis.GraphResponse;
import com.example.news.api.dto.response.analysis.graph.*;
import com.example.news.api.repository.analysis.GraphAnalysisRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GraphAnalysisService {
    private final GraphAnalysisRepository graphAnalysisRepository;

    public GraphAnalysisService(GraphAnalysisRepository graphAnalysisRepository){
        this.graphAnalysisRepository = graphAnalysisRepository;
    }

    public List<PowerCouplesResponse> getPowerCoupleWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getPowerCoupleWithRelativeInterval(intervalUnit,amount);
    }

    public List<EventTrackerResponse> getEventTrackerWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getEventTrackerWithRelativeInterval(intervalUnit, amount);
    }

    public List<GeopoliticalHotspotResponse> getGeopoliticalHotspotWithRelativeInterval (String intervalUnit, int amount){
        return  graphAnalysisRepository.getGeopoliticalHotspotWithRelativeInterval(intervalUnit,amount);
    }

    public List<NarrativeBridgeResponse> getNarrativeBridgeWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getNarrativeBridgeWithRelativeInterval(intervalUnit,amount);
    }

    public List<PublisherFocusResponse> getPublisherFocusWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getPublisherFocusWithRelativeInterval(intervalUnit,amount);
    }

    public List<InfluencerNetworkResponse> getInfluencerNetworkWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getInfluencerNetworkWithRelativeInterval(intervalUnit,amount);
    }

    public List<SpatialMapResponse> getSpatialMapWithRelativeInterval (String intervalUnit, int amount){
        return  graphAnalysisRepository.getSpatialMapWithRelativeInterval(intervalUnit,amount);
    }

    public List<AllianceNetworkResponse> getAllianceNetworkWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getAllianceNetworkWithRelativeInterval(intervalUnit,amount);
    }

    public List<MediaBiasResponse> getMediaBiasWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getMediaBiasWithRelativeInterval(intervalUnit, amount);
    }

    public List<CrisisAndRiskRadarResponse> getCrisisAndRiskRadarWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getCrisisAndRiskRadarWithRelativeInterval(intervalUnit, amount);
    }

    public List<TrendingKeywordClusterResponse> getTrendingKeywordClusterWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getTrendingKeywordClusterWithRelativeInterval(intervalUnit, amount);
    }

    public GraphResponse getEntitiesGraphWithRelativeInterval(String intervalUnit, int amount) {
        return graphAnalysisRepository.getEntitiesGraphWithRelativeInterval(intervalUnit, amount);
    }

    public List<CoOccurrenceCellResponse> getEntityCoOccurrenceMatrixWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getEntityCoOccurrenceMatrixWithRelativeInterval(intervalUnit, amount);
    }

    public List<EntityPolarizationResponse> getEntityPolarizationWithRelativeInterval (String intervalUnit, int amount){
        return graphAnalysisRepository.getEntityPolarizationWithRelativeInterval(intervalUnit, amount);
    }
}
