import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';
import { SimpleGrid,
} from '@mantine/core';
import React from 'react';
import MapMetricsCard from '@/components/RiskMap/components/MapMetricsCard.tsx';

interface CountryRiskMetricsProps {
  countryRisk?: CountryRisk[];
}
const CountryRiskMetrics = ({ countryRisk }: CountryRiskMetricsProps) => {
  let totalArticles = 0;
  let coverageConcentration = 0;
  if(countryRisk) {
     totalArticles = countryRisk.reduce(
      (sum, country) => sum + country.articleCount,
      0,
    );

    const topCountry = countryRisk.reduce<CountryRisk | null>(
      (top, country) =>
        !top || country.articleCount > top.articleCount ? country : top,
      null,
    );

    const totalCountryArticleCount = countryRisk.reduce(
      (sum, country) => sum + country.articleCount,
      0,
    );

      coverageConcentration =
      totalCountryArticleCount > 0 && topCountry
        ? (topCountry.articleCount / totalCountryArticleCount) * 100
        : 0;
  }


  const metricsData = [
    {
      title: 'Countries Covered',
      value: countryRisk ? countryRisk.length : 0,
      tooltip: 'Number of countries with at least one location mentioned.',
    },
    {
      title: 'Total Articles',
      value: totalArticles,
      tooltip:
        'Distinct articles mentioning at least one known country/location.',
    },
    {
      title: 'Top Country',
      value: countryRisk ? countryRisk[0].country : 'N/A',
      tooltip: 'Country receiving the highest number of articles.',
    },
    {
      title: 'Coverage Concentration',
      value: `${coverageConcentration.toFixed(1)}%`,
      tooltip:
        'Share of country-associated articles attributed to the most-covered country.',
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

export default CountryRiskMetrics;