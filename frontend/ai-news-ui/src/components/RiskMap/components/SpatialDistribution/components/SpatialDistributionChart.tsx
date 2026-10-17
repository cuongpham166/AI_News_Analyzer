import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useCallback, useMemo } from 'react';
import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';
import { GEO_MAP_CONFIG } from '@/components/RiskMap/riskMap.utils.ts';
import {
  getSentimentColor,
  buildSpatialDistributionChart,
} from './spatialDistributionChart.utils.ts';
import {
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import { Box, Flex } from '@mantine/core';
import SpatialDistributionLegend
  from '@/components/RiskMap/components/SpatialDistribution/components/SpatialDistributionLegend.tsx';
import type {
  HotspotChartData
} from '@/components/RiskMap/components/GeopoliticalHotspots/components/GeopoliticalHotspotsChart.tsx';

interface SpatialDistributionChartProps {
  spatialMap?: SpatialMap[];
  height?: number | string;
  onLocationClick?: (location: SpatialMap) => void;
}


export const SpatialDistributionChart = ({
  spatialMap,
  height = 500,
  onLocationClick,
}: SpatialDistributionChartProps) => {
  const hasData = Boolean(spatialMap && spatialMap.length > 0);

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
    if (!hasData || !spatialMap) {
      return undefined;
    }

    const maxFreq = Math.max(...spatialMap.map((item) => item.frequency), 1);

    return {
      animationDuration: 500,

      geo: GEO_MAP_CONFIG,

      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',

        formatter: (params: any) => buildSpatialDistributionChart(params),
      },

      series: [
        {
          name: 'Positive Sentiment (≥ 0.10)',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
        },
        {
          name: 'Neutral Sentiment',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
        },
        {
          name: 'Negative Sentiment (≤ -0.10)',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
        },

        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: spatialMap.map((item) => ({
            name: item.location,
            value: [item.longitude, item.latitude, item.frequency],
            rawItem: item,
            itemStyle: {
              color: getSentimentColor(item.avgSentiment),
              opacity: 0.85,
              borderColor: '#FFFFFF',
              borderWidth: 1.5,
              shadowBlur: 4,
              shadowColor: 'rgba(0,0,0,0.15)',
            },
          })),

          symbolSize: (val) => {
            const count = val[2];
            const normalized = count / maxFreq;
            return Math.max(8, Math.round(8 + Math.sqrt(normalized) * 20));
          },

          emphasis: {
            scale: 1.25,
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      ],
    };
  }, [hasData, spatialMap]);

  if (!hasData) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '32px 0',
          color: '#64748B',
          fontSize: '14px',
        }}
      >
        No spatial location distribution data available.
      </div>
    );
  }

  return (
    <Flex direction='column' h='100%'>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <EChartContainer
          option={chartOption}
          height={height}
          onEvents={onEvents}
        />
      </Box>
      <SpatialDistributionLegend />
    </Flex>
  );
};

export default SpatialDistributionChart;