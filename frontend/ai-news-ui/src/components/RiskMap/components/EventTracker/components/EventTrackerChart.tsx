import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useCallback, useMemo } from 'react';
import type { EventTracker } from '@/shared/types/analysis/risk_map/EventTracker.ts';
import { GEO_MAP_CONFIG } from '@/components/RiskMap/riskMap.utils.ts';
import {
  getRiskColor,
  buildEventTrackerChartTooltip,
} from './eventTrackerChart.utils.ts';
import { Box, Flex } from '@mantine/core';
import EventTrackerLegend from '@/components/RiskMap/components/EventTracker/components/EventTrackerLegend.tsx';

interface EventTrackerChartProps {
  events?: EventTracker[];
  height?: number | string;
  onLocationClick?: (location: EventTracker) => void;
}

const EventTrackerChart = ({
  events,
  height = 500,
  onLocationClick,
}: EventTrackerChartProps) => {
  const hasData = Boolean(events && events.length > 0);

  const handleChartClick = useCallback(
    (params: any) => {
      if (
        params.componentType === 'series' &&
        params.seriesType === 'scatter'
      ) {
        const clickedHotspot = params.data as EventTracker;
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
    if (!hasData || !events) {
      return undefined;
    }

    const validEvents = events.filter(
      (item) =>
        Number.isFinite(item.latitude) &&
        Number.isFinite(item.longitude) &&
        item.latitude !== 0 &&
        item.longitude !== 0 &&
        item.frequency > 0,
    );

    const maxFreq = Math.max(...validEvents.map((e) => e.frequency), 1);

    const scatterData = validEvents.map((item) => ({
      name: item.event,
      value: [item.longitude, item.latitude, item.frequency],
      rawItem: item,
      itemStyle: {
        color: getRiskColor(item.riskScore),
        opacity: 0.85,
        borderColor: '#FFFFFF',
        borderWidth: 1.5,
        shadowBlur: 4,
        shadowColor: 'rgba(0,0,0,0.15)',
      },
    }));

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

        formatter: (params: any) => buildEventTrackerChartTooltip(params),
      },

      series: [
        {
          name: 'Low Risk (< 20%)',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
        },
        {
          name: 'Medium Risk (20-50%)',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
        },
        {
          name: 'High Risk (≥ 50%)',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: [],
        },

        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: scatterData,

          symbolSize: (val) => {
            const count = val[2];
            const normalized = count / maxFreq;
            return Math.max(9, Math.round(9 + Math.sqrt(normalized) * 22));
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
  }, [hasData, events]);

  return (
    <Flex direction='column' h='100%'>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <EChartContainer
          option={chartOption}
          height={height}
          onEvents={onEvents}
        />
      </Box>
      <EventTrackerLegend />
    </Flex>
  );
};

export default EventTrackerChart;
