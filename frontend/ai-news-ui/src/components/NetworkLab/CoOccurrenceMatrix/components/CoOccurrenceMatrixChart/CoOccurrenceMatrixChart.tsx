import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';

import type { CoOccurrence } from '@/shared/types/analysis/network_lab/CoOccurrence.ts';
import {
  buildCoOccurrenceHeatmap, buildTooltipChart,
  escapeHtml,
  type HeatmapCell,
  normalizeType,
  relationshipKey,
} from './coOccurrenceMatrixChart.utils.ts';
import {NEWS_ENTITY_COLORS} from '@/shared/constants/NewsEntities.ts';
import CoOccurrenceMatrixLegend from './components/CoOccurrenceMatrixLegend.tsx';
import { Box, Flex } from '@mantine/core';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';

interface CoOccurrenceMatrixChartProps {
  coOccurrence?: CoOccurrence[];
  relationshipType:string;
  topN:string;
  height?: number | string;
}


const CoOccurrenceMatrixChart = ({
  coOccurrence,
                                   relationshipType,
  topN,
  height = 500,
}: CoOccurrenceMatrixChartProps) => {



  const filteredData = useMemo(() => {
    if (!coOccurrence?.length) {
      return [];
    }

    if (relationshipType === 'all') {
      return coOccurrence;
    }

    return coOccurrence.filter(
      (item) => relationshipKey(item.typeA, item.typeB) === relationshipType,
    );
  }, [coOccurrence, relationshipType]);

  const { entities, heatmapData, relationships } = useMemo(
    () => buildCoOccurrenceHeatmap(filteredData, Number(topN)),
    [filteredData, topN],
  );

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!heatmapData.length || !entities.length) {
      return undefined;
    }

    const maxSharedCount = Math.max(
      ...heatmapData.map((item) => item.sharedCount),
      1,
    );

    const rich: Record<string, any> = {};

    for (const entity of entities) {
      const key = `entity_${entity.name.replace(/[^a-zA-Z0-9]/g, '_')}`;

      rich[key] = {
        color: NEWS_ENTITY_COLORS[normalizeType(entity.type)] ?? '#6B7280',
        fontWeight: 600,
      };
    }

    return {
      animation: true,

      tooltip: {
        position: 'bottom',
        formatter: (params: any) => {
          return buildTooltipChart(params)
        },
      },

      grid: {
        top: 70,
        left: 100,
        right: 90,
        bottom: 30,
      },

      xAxis: {
        type: 'category',
        data: entities.map((entity) => entity.name),
        position: 'top',

        axisLabel: {
          interval: 0,
          rotate: 45,

          formatter: (value: string) => {
            const entity = entities.find((item) => item.name === value);

            if (!entity) {
              return value;
            }

            const key = `entity_${value.replace(/[^a-zA-Z0-9]/g, '_')}`;

            return `{${key}|${value}}`;
          },

          rich,
        },

        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },
      },

      yAxis: {
        type: 'category',
        data: entities.map((entity) => entity.name),

        axisLabel: {
          interval: 0,

          formatter: (value: string) => {
            const entity = entities.find((item) => item.name === value);

            if (!entity) {
              return value;
            }

            const key = `entity_${value.replace(/[^a-zA-Z0-9]/g, '_')}`;

            return `{${key}|${value}}`;
          },

          rich,
        },

        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },
      },

      visualMap: {
        min: 0,
        max: maxSharedCount,
        dimension: 2,
        calculable: true,
        orient: 'vertical',
        right: 20,
        bottom: 10,
        itemWidth: 12,
        itemHeight: 100,
        text: ['High coverage', 'Low coverage'],
        inRange: {
          color: ['#F3F4F6', '#DBEAFE', '#93C5FD', '#3B82F6', '#1D4ED8'],
        },
      },

      series: [
        {
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,

            formatter: (params: any) => {
              const data = params.data as HeatmapCell;

              if (!data || data.sharedCount === 0) {
                return '';
              }

              return data.sharedCount.toLocaleString();
            },

            color: '#111827',
            fontWeight: 600,
          },

          itemStyle: {
            borderColor: '#FFFFFF',
            borderWidth: 2,
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
              borderColor: '#111827',
              borderWidth: 2,
            },
          },
        },
      ],
    };
  }, [entities, heatmapData]);


  const hasData = coOccurrence && coOccurrence?.length > 0;
  return (
    <Flex direction='column' h='100%' gap='sm'>
      <Box style={{ flex: 1, minHeight: 0 }}>
        {hasData && chartOption ? (
          <EChartContainer option={chartOption} height={height} />
        ) : (
          <EmptyDataCard
            title='No data available'
            description='No co-occurrence data were found.'
          />
        )}
      </Box>
      <CoOccurrenceMatrixLegend />
    </Flex>
  );
};

export default CoOccurrenceMatrixChart;