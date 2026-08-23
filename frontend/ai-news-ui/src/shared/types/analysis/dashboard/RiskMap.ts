import type { GeopoliticalHotspot } from '@/shared/types/analysis/risk_map/GeopoliticalHotspot.ts';
import type { GeopoliticalMetrics } from '@/shared/types/analysis/risk_map/GeopoliticalMetrics.ts';
import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';
import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';
import type { EventTracker } from '@/shared/types/analysis/risk_map/EventTracker.ts';
import type { EventTrackerMetrics } from '@/shared/types/analysis/risk_map/EventTrackerMetrics.ts';

export interface RiskMapDetail {
  geoHotspot: GeopoliticalHotspot[];
  geoMetrics: GeopoliticalMetrics;
  countryRisk: CountryRisk[];
  spatialMap: SpatialMap[];
  event: EventTracker[];
  eventMetrics: EventTrackerMetrics;
}