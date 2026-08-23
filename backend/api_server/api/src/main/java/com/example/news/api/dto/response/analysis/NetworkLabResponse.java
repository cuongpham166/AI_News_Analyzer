package com.example.news.api.dto.response.analysis;

import com.example.news.api.dto.response.analysis.graph.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NetworkLabResponse {
    private List<AllianceNetworkResponse> allianceNetwork;
    private List<PowerCouplesResponse> powerCouple;
    private List<CoOccurrenceCellResponse> coOccurrenceCell;
    private List<EntityPolarizationResponse> entityPolarization;
    private List<InfluencerNetworkResponse> influencerNetwork;
    private List<NarrativeBridgeResponse> narrativeBridge;
    private List<EventRiskRadarResponse> eventRiskRadar;
    private List<EventMomentumResponse> eventMomentum;
}
