import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json'
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useCallback, useMemo } from 'react';
import type {
  GeopoliticalHotspot,
  GeopoliticalTopic,
} from '@/shared/types/analysis/risk_map/GeopoliticalHotspot.ts';
import { Stack,Text } from '@mantine/core';

import {
  buildRichTooltip,
} from '@/components/RiskMap/components/GeopoliticalHotspots/components/geopoliticalHotspotsChart.utils.ts';
import { GEO_MAP_CONFIG } from '@/components/RiskMap/riskMap.utils.ts';

echarts.registerMap('world', worldGeoJson);

export interface HotspotChartData {
  name: string;
  value: [number, number, number, number];
  location: string;
  country: string;
  countryCode: string;
  articleCount: number;
  avgSentiment: number;
  riskScore: number;
  topics: GeopoliticalTopic[];
}

interface GeopoliticalHotspotsChartsProps {
  geoHotspot?: GeopoliticalHotspot[];
  height?: number | string;
  onLocationClick?: (location: HotspotChartData) => void;
}

const GeopoliticalHotspotsCharts = (props: GeopoliticalHotspotsChartsProps) => {
  const { geoHotspot, height = 500, onLocationClick } = props;
  const hasData = Boolean(geoHotspot && geoHotspot.length > 0);

  const seriesData = useMemo<HotspotChartData[]>(() => {
    if (!geoHotspot) return [];

    return geoHotspot.map((item) => ({
      name: item.location,
      value: [item.longitude, item.latitude, item.articleCount, item.riskScore],
      location: item.location,
      country: item.country,
      countryCode: item.countryCode,
      articleCount: item.articleCount,
      avgSentiment: item.avgSentiment,
      riskScore: item.riskScore,
      topics: item.topics ?? [],
    }));
  }, [geoHotspot]);

  const handleChartClick = useCallback(
    (params: any) => {
      if (
        params.componentType === 'series' &&
        params.seriesType === 'scatter'
      ) {
        const clickedHotspot = params.data as HotspotChartData;
        if (onLocationClick && clickedHotspot) {
          onLocationClick(clickedHotspot);
        }
      }
    },
    [onLocationClick],
  );

  const onEvents = useMemo(
    () => ({
      click: handleChartClick,
    }),
    [handleChartClick],
  );

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) return undefined;

    return {
      animationDuration: 600,

      geo: GEO_MAP_CONFIG,

      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',

        formatter: (params: any) => buildRichTooltip(params),
      },

      visualMap: {
        type: 'continuous',
        min: 0,
        max: 1,
        dimension: 3,
        calculable: true,
        orient: 'vertical',
        top: 'center',
        left: 10,
        text: ['High Risk', 'Low Risk'],
        textStyle: { color: '#64748B', fontSize: 11 },
        inRange: {
          color: ['#10B981', '#F59E0B', '#EF4444'],
        },
      },

      series: [
        {
          name: 'Hotspots',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: seriesData,

          symbolSize: (val: number[]) => {
            const count = val[2] || 1;
            return Math.max(10, Math.round(10 + Math.log2(count) * 4));
          },

          itemStyle: {
            opacity: 0.85,
            shadowBlur: 8,
            shadowColor: 'rgba(0,0,0,0.3)',
          },

          emphasis: {
            scale: true,
            itemStyle: {
              opacity: 1,
              borderColor: '#FFFFFF',
              borderWidth: 2,
            },
          },
        },
      ],
    };
  }, [hasData, seriesData]);
  return (
    <Stack>
      <EChartContainer
        option={chartOption}
        height={height}
        onEvents={onEvents}
      />
      <Text c='red.4'>Top 100 locations by article volume.</Text>
    </Stack>
  );
};

export default GeopoliticalHotspotsCharts;
