import DashboardCard from '@/components/generic/DashboardCard';
import { useState } from 'react';
import { SegmentedControl } from '@mantine/core';

import CountryRiskCard from '@/components/RiskMap/components/CountryRisk';
import SpatialDistributionCard from '@/components/RiskMap/components/SpatialDistribution';
import GeopoliticalHotspotsCard from '@/components/RiskMap/components/GeopoliticalHotspots';
import EventTrackerCard from '@/components/RiskMap/components/EventTracker';

import type { RiskMapDetail } from '@/shared/types/analysis/dashboard/RiskMap.ts';

interface Props {
  data?: RiskMapDetail;
}

type ViewState = 'hotspots' | 'distribution' | 'risk' | 'event';

const RiskMapCard = ({ data }: Props) => {
  const [view, setView] = useState<ViewState>('hotspots');

  const loadView = () => {
    switch (view) {
      case 'hotspots':
        return (
          <GeopoliticalHotspotsCard geoHotspot={data?.geoHotspot} geoMetrics={data?.geoMetrics} />
        );
      case 'distribution':
        return <SpatialDistributionCard spatialMap={data?.spatialMap} />;
      case 'risk':
        return <CountryRiskCard countryRisk={data?.countryRisk} />;
      case 'event':
        return <EventTrackerCard event={data?.event} eventMetrics={data?.eventMetrics} />;
      default:
        return <></>;
    }
  };

  return (
    <DashboardCard
      title='Geographic News Coverage'
      description='Explore where news coverage is concentrated and how sentiment varies across locations.'
      toolbar={
        <SegmentedControl
          value={view}
          onChange={(val) => setView(val as ViewState)}
          data={[
            { label: 'Hotspots', value: 'hotspots' },
            { label: 'Spatial', value: 'distribution' },
            { label: 'Country Risk', value: 'risk' },
            { label: 'Event Tracker', value: 'event' },
          ]}
        />
      }
      children={loadView()}
    />
  );
};

export default RiskMapCard;