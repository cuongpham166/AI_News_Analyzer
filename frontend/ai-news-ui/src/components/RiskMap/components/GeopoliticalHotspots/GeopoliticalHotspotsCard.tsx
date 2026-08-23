import DashboardSection from '@/components/generic/DashboardSection';
import { Stack } from '@mantine/core';
import { GeopoliticalHotspotsMetrics, GeopoliticalHotspotsCharts } from './components'
import type { GeopoliticalHotspot } from '@/shared/types/analysis/risk_map/GeopoliticalHotspot.ts';
import type { GeopoliticalMetrics } from '@/shared/types/analysis/risk_map/GeopoliticalMetrics.ts';

interface Props {
  geoHotspot?: GeopoliticalHotspot[];
  geoMetrics?: GeopoliticalMetrics;
}
const GeopoliticalHotspotsCard = ({ geoHotspot, geoMetrics }:Props) => {
  return (
    <DashboardSection
      title='Geopolitical Hotspots'
      description='Highlights locations receiving the most coverage, helping identify regions attracting the greatest attention.'
      children={
        <Stack>
          <GeopoliticalHotspotsMetrics geoMetrics={geoMetrics}/>
          <GeopoliticalHotspotsCharts geoHotspot={geoHotspot}/>
        </Stack>
      }
    />
  );
};

export default GeopoliticalHotspotsCard;