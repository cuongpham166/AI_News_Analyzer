import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';
import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';
import { SimpleGrid } from '@mantine/core';
import React from 'react';

interface SpatialDistributionMetricsProps {
  spatialMap?: SpatialMap[];
}
const SpatialDistributionMetrics = ({
  spatialMap,
}: SpatialDistributionMetricsProps) => {

  let totalMentions = 0;
  let topLocation;
  let locationConcentration = 0;

  if(spatialMap) {
    totalMentions = spatialMap.reduce(
      (sum, location) => sum + location.count,
      0,
    );
    topLocation = spatialMap.reduce<SpatialMap | null>(
      (top, location) => (!top || location.count > top.count ? location : top),
      null,
    );
    locationConcentration =
      totalMentions > 0 && topLocation
        ? (topLocation.count / totalMentions) * 100
        : 0;
  }

  const metricsData = [
    {
      title: 'Locations Covered',
      value: spatialMap ? spatialMap.length : 0,
      tooltip: 'Number of distinct locations mentioned in the news.',
    },
    {
      title: 'Total Mentions',
      value: totalMentions,
      tooltip: 'Total number of location mentions across the selected period.',
    },
    {
      title: 'Top Location',
      value: topLocation?.location ?? 'N/A',
      tooltip: 'Location with the highest number of associated articles.',
    },
    {
      title: 'Location Concentration',
      value: `${locationConcentration.toFixed(1)}%`,
      tooltip:
        'Share of location mentions attributed to the most-mentioned location.',
    },
  ];
  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing='md'>
      {metricsData.map((item, index) => (
        <MapMetricsCard
          title={item.title}
          value={item.value}
          tooltip={item.tooltip}
          index={index}
        />
      ))}
    </SimpleGrid>
  );
};

export default SpatialDistributionMetrics;