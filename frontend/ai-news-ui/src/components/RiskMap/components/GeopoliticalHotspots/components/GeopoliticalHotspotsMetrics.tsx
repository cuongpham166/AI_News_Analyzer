import {SimpleGrid} from '@mantine/core';
import React from 'react';
import type { GeopoliticalMetrics } from '@/shared/types/analysis/risk_map/GeopoliticalMetrics.ts';

import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';

interface GeopoliticalHotspotsMetricsProps {
  geoMetrics?: GeopoliticalMetrics;
}

const formatSentiment = (val?: number) => {
  if (val === undefined || val === null || isNaN(val)) return 'N/A';
  const formatted = val.toFixed(2);
  return val > 0 ? `+${formatted}` : `${formatted}`;
};

const formatRiskScore = (val?: number) => {
  if (val === undefined || val === null || isNaN(val)) return 'N/A';
  return `${Math.round(val * 100)}%`;
};

const GeopoliticalHotspotsMetrics = ({
  geoMetrics,
}: GeopoliticalHotspotsMetricsProps) => {
  const metricsData = [
    {
      title: 'Total Articles',
      value: geoMetrics ? geoMetrics.totalArticles.toLocaleString() : 'N/A',
      tooltip: 'Total volume of news coverage across all tracked hotspots.',
    },
    {
      title: 'Hotspots',
      value: geoMetrics ? geoMetrics.hotspots : 'N/A',
      tooltip: 'Unique geographic locations identified across news coverage.',
    },
    {
      title: 'Avg. Risk Score',
      value: formatRiskScore(geoMetrics?.avgRiskScore),
      tooltip:
        'Aggregate ratio of negative risk coverage across all active hotspots.',
      statusColor:
        geoMetrics?.avgRiskScore && geoMetrics.avgRiskScore >= 0.6
          ? '#EF4444'
          : undefined,
    },
    {
      title: 'Avg. Sentiment',
      value: formatSentiment(geoMetrics?.avgSentiment),
      tooltip:
        'Average sentiment score ranging from -1.0 (Negative) to +1.0 (Positive).',
    },
    {
      title: 'Countries',
      value: geoMetrics ? geoMetrics.countries : 'N/A',
      tooltip: 'Total distinct sovereign countries covered.',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 5 }} spacing='md'>
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