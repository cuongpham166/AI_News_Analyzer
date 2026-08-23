import type { AllianceNetwork } from '@/shared/types/analysis/network_lab/AllianceNetwork.ts';
import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import type { CoOccurrence } from '@/shared/types/analysis/network_lab/CoOccurrence.ts';
import type { EntityPolarizationSentiment, InfluencerNetwork } from '@/shared/types/analysis';
import type { NarrativeBridge } from '@/shared/types/analysis/network_lab/NarrativeBridge.ts';
import type { EventRisk } from '@/shared/types/analysis/network_lab/EventRisk.ts';
import type { EventMomentum } from '@/shared/types/analysis/network_lab/EventMomentum.ts';

export interface NetworkLabDetail {
  allianceNetwork: AllianceNetwork[];
  powerCouple: PowerCouple[];
  coOccurrenceCell: CoOccurrence[];
  entityPolarization: EntityPolarizationSentiment[];
  influencerNetwork: InfluencerNetwork[];
  narrativeBridge: NarrativeBridge[];
  eventRiskRadar: EventRisk[];
  eventMomentum: EventMomentum[];
}