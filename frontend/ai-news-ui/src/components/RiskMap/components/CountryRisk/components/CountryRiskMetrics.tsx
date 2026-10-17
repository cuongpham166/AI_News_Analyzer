import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';
import { SimpleGrid,
} from '@mantine/core';
import React, { useMemo } from 'react';
import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';

interface CountryRiskMetricsProps {
  countryRisk?: CountryRisk[];
}
const CountryRiskMetrics = ({ countryRisk }: CountryRiskMetricsProps) => {
  const metrics = useMemo(() => {
    if (!countryRisk || countryRisk.length === 0) {
      return {
        countriesCovered: 0,
        totalMentions: 0,
        topCountry: 'N/A',
        coverageConcentration: '0.0%',
        avgSentimentDisplay: '0.00',
        overallRiskDisplay: '0%',
      };
    }

    const countriesCovered = countryRisk.length;

    const totalMentions = countryRisk.reduce(
      (sum, item) => sum + item.frequency,
      0,
    );

    const topCountryItem = countryRisk.reduce<CountryRisk | null>(
      (top, item) => (!top || item.frequency > top.frequency ? item : top),
      null,
    );

    const concentrationVal =
      totalMentions > 0 && topCountryItem
        ? (topCountryItem.frequency / totalMentions) * 100
        : 0;

    const totalWeightedSentiment = countryRisk.reduce(
      (sum, item) => sum + item.avgSentiment * item.frequency,
      0,
    );
    const weightedAvgSentiment =
      totalMentions > 0 ? totalWeightedSentiment / totalMentions : 0;

    const totalWeightedRisk = countryRisk.reduce(
      (sum, item) => sum + (item.riskScore ?? 0) * item.frequency,
      0,
    );
    const weightedRisk =
      totalMentions > 0 ? totalWeightedRisk / totalMentions : 0;

    return {
      countriesCovered,
      totalMentions,
      topCountry: topCountryItem?.country ?? 'N/A',
      coverageConcentration: `${concentrationVal.toFixed(1)}%`,
      avgSentimentDisplay:
        weightedAvgSentiment > 0
          ? `+${weightedAvgSentiment.toFixed(2)}`
          : weightedAvgSentiment.toFixed(2),
      overallRiskDisplay: `${Math.round(weightedRisk * 100)}%`,
    };
  }, [countryRisk]);

  const metricsData = [
    {
      title: 'Countries Covered',
      value: metrics.countriesCovered.toLocaleString(),
      tooltip: 'Number of distinct countries with recorded news mentions.',
    },
    {
      title: 'Total Mentions',
      value: metrics.totalMentions.toLocaleString(),
      tooltip: 'Total volume of mentions attributed to known countries.',
    },
    {
      title: 'Top Country',
      value: metrics.topCountry,
      tooltip: 'Country receiving the highest volume of news coverage.',
    },
    {
      title: 'Coverage Concentration',
      value: metrics.coverageConcentration,
      tooltip:
        'Share of total country coverage concentrated in the top country.',
    },
    {
      title: 'Avg. Sentiment',
      value: metrics.avgSentimentDisplay,
      tooltip: 'Volume-weighted average sentiment across all country mentions.',
    },
    {
      title: 'Risk Index',
      value: metrics.overallRiskDisplay,
      tooltip:
        'Proportion of total country coverage associated with adverse/negative sentiment.',
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

export default CountryRiskMetrics;