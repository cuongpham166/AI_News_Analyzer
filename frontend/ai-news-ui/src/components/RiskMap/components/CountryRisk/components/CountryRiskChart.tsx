import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';
import type { CountryRisk } from '@/shared/types/analysis/risk_map/CountryRisk.ts';


interface CountryRiskChartProps {
  countryRisk?: CountryRisk[];
  height?: number | string;
}

const CountryRiskChart = (props: CountryRiskChartProps) => {
  const {countryRisk, height=500 } = props;

  let mapData = []
  let maxArticleCount = 0;

  if (countryRisk) {
    mapData = countryRisk
      .filter(
        (country) =>
          Number.isFinite(country.articleCount) && country.articleCount > 0,
      )
      .map((country) => ({
        name: country.country,
        value: country.articleCount,
        articleCount: country.articleCount,
        coveragePercent: Number.isFinite(country.coveragePercent)
          ? country.coveragePercent
          : 0,
        avgSentiment: Number.isFinite(country.avgSentiment)
          ? country.avgSentiment
          : 0,
        countryCode: country.countryCode,
      }));

    const values = mapData.map((item) => item.value);
    maxArticleCount = Math.max(...values, 1);
  }

  const chartOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data;

          if (!data) {
            return params.name;
          }

          return `
        <div>
          <strong>${params.name}</strong>
          <br />
          Articles: ${data.articleCount.toLocaleString()}
          <br />
          Coverage: ${data.coveragePercent.toFixed(1)}%
          <br />
          Sentiment: ${data.avgSentiment.toFixed(2)}
        </div>
      `;
        },
      },

      visualMap: {
        min: 0,
        max: maxArticleCount,
        calculable: true,
        left: 'left',
        bottom: 20,
        text: ['High coverage', 'Low coverage'],
        inRange: {
          color: ['#dbeafe', '#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'],
        },
      },

      series: [
        {
          type: 'map',
          map: 'world',
          roam: true,

          data: mapData,

          itemStyle: {
            areaColor: '#172033', // countries with no data
            borderColor: '#475569',
            borderWidth: 0.5,
          },

          emphasis: {
            itemStyle: {
              areaColor: '#243047',
            },
            label: {
              show: true,
              color: '#ffffff',
            },
          },
        },
      ],
    };
  }, [mapData, maxArticleCount]);
  return <EChartContainer option={chartOption} height={height} />;
};

export default CountryRiskChart;