import type { TrendingKeywords } from '@/shared/types/analysis/TrendingKeywords.ts';
import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Flex, Box } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import TrendingKeywordClustersLegends from './components/TrendingKeywordClustersLegends.tsx';
import {NEWS_TOPIC_COLORS} from '@/shared/constants/NewsTopics.ts';

interface TrendingKeywordClustersChartProps {
  data: TrendingKeywords[];
  height?: number;
}
const TrendingKeywordClustersChart = ({ data, height = 450 }:TrendingKeywordClustersChartProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const sorted = [...data].sort((a, b) => b.coOccurrence - a.coOccurrence).slice(0,15);
    return {
      animationDuration: 500,
      grid: {
        left: 220,
        right: 50,
        top: 20,
        bottom: 40,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },

        formatter: (params: any[]) => {
          const item = sorted[params[0].dataIndex];

          return `
            <strong>${item.keyPhrase}</strong>
            <br />
            Topic: ${item.topic}
            <br />
            Co-occurrence: <strong>${item.coOccurrence}</strong>
            <br />
            Avg. sentiment: ${item.avgSentiment.toFixed(2)}
          `;
        },
      },

      xAxis: {
        type: 'value',
        name: 'Co-occurrence',
        nameLocation: 'middle',
        nameGap: 30,
        minInterval: 1,
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: sorted.map((item) => item.keyPhrase),

        axisLabel: {
          width: 200,
          overflow: 'truncate',
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
          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
            color: '#495057',
            fontWeight: 600,
          },
        },
      ],
    };
  }, [data]);
  return (
    <DashboardSection
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'>
            <TrendingKeywordClustersLegends/>
          </Box>
        </Flex>
      }
    />
  );
};

export default TrendingKeywordClustersChart