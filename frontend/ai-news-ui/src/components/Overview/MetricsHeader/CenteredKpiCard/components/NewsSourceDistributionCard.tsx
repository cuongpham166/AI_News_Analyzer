import type { MetaDataDistribution } from '@/shared/types/analysis/macro_pulse/MetaDataDistribution.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { Box, Stack, Group, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import {NEWS_SOURCES_NAMES, NEWS_SOURCES_COLORS} from '@/shared/constants/NewsSources.ts';
import type { SourceDistributionOverview } from '@/shared/types/analysis/dashboard/MacroPulse.ts';

interface NewsSourceDistributionCardProps {
  height?: number | string;
  data: SourceDistributionOverview;
}
const NewsSourceDistributionCard = ({ data, height = 300 }:NewsSourceDistributionCardProps) => {
  const totalValue = data.reduce(
    (total, source) => total + source.newsCount,
    0,
  );

  const sortedData = [...data].sort((a, b) => b.newsCount - a.newsCount);
  const names = sortedData.map((item) => NEWS_SOURCES_NAMES[item.name]);

  const chartOption = useMemo<EChartsOption>(() => {
    return {

      xAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          interval: 0,
          rotate: 35,
          fontSize: 10,
          formatter: (value: string) =>
            value.charAt(0).toUpperCase() + value.slice(1),
        },
        axisTick: {
          alignWithLabel: true,
        },
      },

      yAxis: {
        type: 'value',
        name: 'Articles',
      },

      series: [
        {
          encode: { x: 'mentions', y: 'topic' },
          data: sortedData.map((item) => ({
            value: item.newsCount,
            itemStyle: {
              color: NEWS_SOURCES_COLORS[item.name],
            },
          })),
          type: 'bar',
          label: {
            show: true,
            position: 'top',
            formatter: (params) => params.value,
            color: '#495057',
            fontWeight: 600,
          },
        },
      ],
    };
  }, [names, sortedData]);
  return (
    <Stack gap='md'>
      <Group justify='space-between' align='flex-end'>
        <Box>
          <Text size='xs' c='dimmed'>
            Total articles
          </Text>

          <Text fw={700} size='xl'>
            {totalValue.toLocaleString()}
          </Text>
        </Box>

        <Text size='xs' c='dimmed'>
          {data.length} sources
        </Text>
      </Group>
      <Box h={height} w='100%'>
        <EChartContainer option={chartOption} height={height} />
      </Box>
    </Stack>
  );
};

export default NewsSourceDistributionCard;