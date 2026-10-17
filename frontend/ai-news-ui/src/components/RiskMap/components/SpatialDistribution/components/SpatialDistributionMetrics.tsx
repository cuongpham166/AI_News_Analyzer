import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';
import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';
import { SimpleGrid } from '@mantine/core';
import React, { useMemo } from 'react';

interface SpatialDistributionMetricsProps {
  spatialMap?: SpatialMap[];
}
const SpatialDistributionMetrics = ({
  spatialMap,
}: SpatialDistributionMetricsProps) => {
  const metrics = useMemo(() => {
    if (!spatialMap || spatialMap.length === 0) {
      return {
        locationsCovered: 0,
        totalMentions: 0,
        topLocation: 'N/A',
        locationConcentration: '0.0%',
        avgSentimentDisplay: '0.00',
        overallRiskDisplay: '0%',
      };
    }

    const locationsCovered = spatialMap.length;

    const totalMentions = spatialMap.reduce(
      (sum, item) => sum + item.frequency,
      0,
    );

    const topLocationItem = spatialMap.reduce<SpatialMap | null>(
      (top, item) => (!top || item.frequency > top.frequency ? item : top),
      null,
    );

    const concentrationVal =
      totalMentions > 0 && topLocationItem
        ? (topLocationItem.frequency / totalMentions) * 100
        : 0;

    const totalSentiment = spatialMap.reduce(
      (sum, item) => sum + item.avgSentiment * item.frequency,
      0,
    );
    const weightedAvgSentiment =
      totalMentions > 0 ? totalSentiment / totalMentions : 0;

    const totalRisk = spatialMap.reduce(
      (sum, item) => sum + (item.riskScore ?? 0) * item.frequency,
      0,
    );
    const weightedRisk = totalMentions > 0 ? totalRisk / totalMentions : 0;

    return {
      locationsCovered,
      totalMentions,
      topLocation: topLocationItem?.location ?? 'N/A',
      locationConcentration: `${concentrationVal.toFixed(1)}%`,
      avgSentimentDisplay:
        weightedAvgSentiment > 0
          ? `+${weightedAvgSentiment.toFixed(2)}`
          : weightedAvgSentiment.toFixed(2),
      overallRiskDisplay: `${Math.round(weightedRisk * 100)}%`,
    };
  }, [spatialMap]);

  const metricsData = [
    {
      title: 'Locations Covered',
      value: metrics.locationsCovered.toLocaleString(),
      tooltip: 'Number of distinct locations mentioned across coverage.',
    },
    {
      title: 'Total Mentions',
      value: metrics.totalMentions.toLocaleString(),
      tooltip: 'Total volume of location mentions across the selected period.',
    },
    {
      title: 'Top Location',
      value: metrics.topLocation,
      tooltip: 'Location driving the highest volume of news coverage.',
    },
    {
      title: 'Location Concentration',
      value: metrics.locationConcentration,
      tooltip:
        'Share of total location mentions concentrated in the top location.',
    },
    {
      title: 'Avg. Sentiment',
      value: metrics.avgSentimentDisplay,
      tooltip: 'Weighted average sentiment score across all location mentions.',
    },
    {
      title: 'Risk Index',
      value: metrics.overallRiskDisplay,
      tooltip:
        'Overall proportion of location coverage associated with negative sentiment.',
    },
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 3, md: 3 }} spacing='md'>
      {metricsData.map((item, index) => (
        <MapMetricsCard
          key={item.title}
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