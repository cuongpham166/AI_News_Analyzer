import type { TrendingKeywords } from '@/shared/types/analysis/media_bias/TrendingKeywords.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Flex, Box } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import TrendingKeywordClustersLegends from './components/TrendingKeywordClustersLegends.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  buildTrendingKeywordClustersTooltip,
} from '@/components/MediaBias/TrendingKeywordClusters/TrendingKeywordClustersChart/trendingKeywordClustersChart.utils.ts';

interface TrendingKeywordClustersChartProps {
  trendingKeyword?: TrendingKeywords[];
  height?: number;
}

const TrendingKeywordClustersChart = ({ trendingKeyword, height = 450 }:TrendingKeywordClustersChartProps) => {
  const hasData = Boolean(trendingKeyword && trendingKeyword.length > 0);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !trendingKeyword) {
      return undefined;
    }

    const sorted = [...trendingKeyword]
      .sort((a, b) => b.coOccurrence - a.coOccurrence)
      .slice(0, 15);

    return {
      animationDuration: 500,

      grid: {
        top: 40,
        right: 40,
        bottom: 40,
        left: 170,
        containLabel: false,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',

        formatter: (params: any[]) =>
          buildTrendingKeywordClustersTooltip(sorted, params),
      },

      xAxis: {
        type: 'value',
        name: 'Co-occurrence Volume',
        nameLocation: 'middle',
        nameGap: 28,
        min: 0,
        minInterval: 1,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E2E8F0',
          },
        },
        axisLabel: {
          color: '#64748B',
          fontSize: 11,
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: sorted.map((item) => item.keyPhrase),
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          width: 150,
          overflow: 'truncate',
          color: '#334155',
          fontSize: 12,
          fontWeight: 500,
        },
      },

      series: [
        {
          name: 'Positive Co-occurrence',
          type: 'bar',
          stack: 'coOccurrence',
          data: sorted.map((item) => item.positiveCoOccurrence),
          itemStyle: {
            color: NEWS_SENTIMENT_COLORS['positive'],
          },
          barMaxWidth: 24,
        },
        {
          name: 'Negative Co-occurrence',
          type: 'bar',
          stack: 'coOccurrence',
          data: sorted.map((item) => item.negativeCoOccurrence),
          itemStyle: {
            color: NEWS_SENTIMENT_COLORS['negative'],
          },
          barMaxWidth: 24,
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