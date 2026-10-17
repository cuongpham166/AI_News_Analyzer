import { useState } from 'react';
import DashboardSection from '@/components/generic/DashboardSection';
import { Stack } from '@mantine/core';
import {
  GeopoliticalHotspotsMetrics,
  GeopoliticalHotspotsCharts,
  GeopoliticalHotspotNewsSidebar,
} from './components';
import type { GeopoliticalHotspot } from '@/shared/types/analysis/risk_map/GeopoliticalHotspot.ts';
import type { GeopoliticalMetrics } from '@/shared/types/analysis/risk_map/GeopoliticalMetrics.ts';

import { useDisclosure } from '@mantine/hooks';
import type {
  HotspotChartData
} from '@/components/RiskMap/components/GeopoliticalHotspots/components/GeopoliticalHotspotsChart.tsx';

interface Props {
  geoHotspot?: GeopoliticalHotspot[];
  geoMetrics?: GeopoliticalMetrics;
}
const GeopoliticalHotspotsCard = ({ geoHotspot, geoMetrics }:Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [locationName, setLocationName] = useState<string>('');


  const handleLocationClick = (locationData: HotspotChartData) => {
    setLocationName(locationData.location);
    open()
  };

  const onClose =() => {
    close()
  }

  return (
    <DashboardSection
      title='Geopolitical Hotspots'
      description='Highlights locations receiving the most coverage, helping identify regions attracting the greatest attention.'
      children={
        <Stack>
          <GeopoliticalHotspotsMetrics geoMetrics={geoMetrics} />
          <GeopoliticalHotspotsCharts
            geoHotspot={geoHotspot}
            onLocationClick={handleLocationClick}
          />

          <GeopoliticalHotspotNewsSidebar
            locationName={locationName}
            opened={opened}
            onClose={onClose}
          />
        </Stack>
      }
    />
  );
};

export default GeopoliticalHotspotsCard;