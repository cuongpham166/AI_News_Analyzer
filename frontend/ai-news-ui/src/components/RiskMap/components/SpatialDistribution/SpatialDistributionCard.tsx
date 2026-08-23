import DashboardSection from '@/components/generic/DashboardSection';
import { Stack } from '@mantine/core';
import {SpatialDistributionChart, SpatialDistributionMetrics} from './components'
import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';

interface Props {
  spatialMap?: SpatialMap[];
}
const SpatialDistributionCard = ({ spatialMap }: Props) => {
  return (
    <DashboardSection
      title='Spatial Distribution'
      description='Maps individual locations mentioned in the news to reveal the geographic spread and density of coverage.'
      children={
        <Stack>
          <SpatialDistributionMetrics spatialMap={spatialMap}/>
          <SpatialDistributionChart spatialMap={spatialMap}/>
        </Stack>
      }
    />
  );
};

export default SpatialDistributionCard;