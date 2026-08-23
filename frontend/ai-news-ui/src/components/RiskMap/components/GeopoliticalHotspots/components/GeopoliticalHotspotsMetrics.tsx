import {SimpleGrid} from '@mantine/core';
import React from 'react';
import type { GeopoliticalMetrics } from '@/shared/types/analysis/risk_map/GeopoliticalMetrics.ts';

import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';
interface GeopoliticalHotspotsMetricsProps {
  geoMetrics?: GeopoliticalMetrics;
}
const GeopoliticalHotspotsMetrics = ({
  geoMetrics,
}: GeopoliticalHotspotsMetricsProps) => {
  console.log('GeopoliticalHotspotsMetrics', geoMetrics);
  const metricsData = [
    {
      title: 'Articles',
      value: geoMetrics ? geoMetrics.totalArticles : 'N/A',
      tooltip: '',
    },
    {
      title: 'Hotspots',
      value: geoMetrics ? geoMetrics.hotspots : 'N/A',
      tooltip:
        'A hotspot represents a unique geographic point within a country, regardless of which alias was used in the news article.',
    },
    {
      title: 'Avg. Sentiment Score.',
      value: geoMetrics ? geoMetrics.avgSentiment : 'N/A',
      tooltip: '',
    },
    {
      title: 'Countries',
      value: geoMetrics ? geoMetrics.countries : 'N/A',
      tooltip: '',
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


export default GeopoliticalHotspotsMetrics