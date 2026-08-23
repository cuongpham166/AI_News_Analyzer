import type { TrendingKeywords } from '@/shared/types/analysis/media_bias/TrendingKeywords.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Flex, Box } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import TrendingKeywordClustersLegends from './components/TrendingKeywordClustersLegends.tsx';
import {NEWS_TOPIC_COLORS} from '@/shared/constants/NewsTopics.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';

interface TrendingKeywordClustersChartProps {
  trendingKeyword?: TrendingKeywords[];
  height?: number;
}
const TrendingKeywordClustersChart = ({ trendingKeyword, height = 450 }:TrendingKeywordClustersChartProps) => {
  const hasData = trendingKeyword && trendingKeyword.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    const sorted = [...trendingKeyword]
      .sort((a, b) => b.coOccurrence - a.coOccurrence)
      .slice(0, 15);

    return {
      animationDuration: 500,

      grid: GRID_CONFIG,

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },

        formatter: (params: any[]) => {
          const item = sorted[params[0].dataIndex];

          return `
            <strong>${item.keyPhrase}</strong>
             <div style="margin-top: 6px">
              Topic:
              ${item.topic.charAt(0).toUpperCase() + item.topic.slice(1)}
            </div>
            <div>
              Co-occurrence:
              <strong>${item.coOccurrence}</strong>
            </div>
            <div>
              Avg. sentiment:
              <strong>${item.avgSentiment.toFixed(2)}</strong>
            </div>
          `;
        },
      },

      xAxis: {
        type: 'value',

        name: 'Co-occurrence',
        nameLocation: 'middle',
        nameGap: 30,

        min: 0,
        minInterval: 1,

        splitLine: {
          lineStyle: {
            type: 'dashed',
            opacity: 0.35,
          },
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,

        data: sorted.map((item) => item.keyPhrase),

        axisTick: {
          show: false,
        },

        axisLine: {
          show: false,
        },

        axisLabel: {
          width: 160,
          overflow: 'truncate',
          color: '#475569',
        },
      },

      series: [
        {
          type: 'bar',
          data: sorted.map((item) => ({
            value: item.coOccurrence,
            itemStyle: {
              color: NEWS_TOPIC_COLORS[item.topic],
            },
          })),
          barMaxWidth: 28,
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            color: '#495057',
            fontWeight: 600,
          },
          emphasis: {
            focus: 'series',
          },
        },
      ],
    };
  }, [hasData, trendingKeyword]);
  return (
    <DashboardSection
      children={
        <Flex direction='column' h='100%' gap='sm'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No trending keyword data were found for this selection.'
              />
            )}
          </Box>
          <TrendingKeywordClustersLegends />
        </Flex>
      }
    />
  );
};

export default TrendingKeywordClustersChart