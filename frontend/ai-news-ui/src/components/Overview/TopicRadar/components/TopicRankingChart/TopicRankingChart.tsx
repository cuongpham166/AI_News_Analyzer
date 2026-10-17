import React, { useMemo, useState } from 'react';
import { Stack, Text, Title, Flex, Box } from '@mantine/core';
import DashboardSection from '@/components/generic/DashboardSection';
import type { TopicRadarType } from '@/shared/interfaces/analysis/ExecutiveOverview/TopicRadarType.ts';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import {
  NEWS_TOPIC_COLORS,
} from '@/shared/constants/NewsTopics.ts';
import TopicRankingLegend
  from '@/components/Overview/TopicRadar/components/TopicRankingChart/components/TopicRankingLegend.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';

interface TopicRankingChartProps {
  data?: TopicRadarType;
  height?: number | string;
}

const TopicRankingChart = ({ data, height = 400 }: TopicRankingChartProps) => {
  const distribution = data?.distribution ?? [];

  const sortedDistribution = [...distribution].sort(
    (a, b) => a.count - b.count,
  );

  const hasData = sortedDistribution.length > 0;

  const names = sortedDistribution.map((item) => item.name);

  const chartOption = useMemo<EChartsOption|undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    return {
      yAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          interval: 0,
          formatter: (value: string) =>
            value.charAt(0).toUpperCase() + value.slice(1),
        },
      },

      xAxis: {
        type: 'value',
        name: 'Mentions',
      },

      grid:GRID_CONFIG,

      series: [
        {
          data: sortedDistribution.map((item) => ({
            value: item.count,
            itemStyle: {
              color: NEWS_TOPIC_COLORS[item.name],
            },
          })),

          type: 'bar',

          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => params.value,
            color: '#495057',
            fontWeight: 600,
          },
        },
      ],
    };
  }, [sortedDistribution, names, hasData]);

  return (
    <DashboardSection
      title='Topics by Volume'
      description='Compare the number of articles in each topic'
    >
      <Flex direction='column' h='100%' gap='sm'>
        {hasData && chartOption ? (
          <>
            <Box style={{ flex: 1, minHeight: 0 }}>
              <EChartContainer option={chartOption} height={height} />
            </Box>
            <TopicRankingLegend />
          </>
        ) : (
          <EmptyDataCard
            title='No data available'
            description='No topics were found for this selection.'
            height={height}
          />
        )}
      </Flex>
    </DashboardSection>
  );
};

export default TopicRankingChart;
