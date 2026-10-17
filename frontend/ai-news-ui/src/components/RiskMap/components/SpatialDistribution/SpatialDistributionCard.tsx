import DashboardSection from '@/components/generic/DashboardSection';
import { Stack } from '@mantine/core';
import {SpatialDistributionChart, SpatialDistributionMetrics, SpatialDistributionNewsSidebar} from './components'
import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

interface Props {
  spatialMap?: SpatialMap[];
}
const SpatialDistributionCard = ({ spatialMap }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [locationName, setLocationName] = useState<string>('');

  const handleLocationClick = (locationData: SpatialMap) => {
    setLocationName(locationData.name);
    open();
  };

  const onClose = () => {
    close();
  }
  ;
  return (
    <DashboardSection
      title='Spatial Distribution'
      description='Maps individual locations mentioned in the news to reveal the geographic spread and density of coverage.'
      children={
        <Stack>
          <SpatialDistributionMetrics spatialMap={spatialMap} />
          <SpatialDistributionChart
            spatialMap={spatialMap}
            onLocationClick={handleLocationClick}
          />
          <SpatialDistributionNewsSidebar
            locationName={locationName}
            opened={opened}
            onClose={onClose}
          />
        </Stack>
      }
    />
  );
};

export default SpatialDistributionCard;