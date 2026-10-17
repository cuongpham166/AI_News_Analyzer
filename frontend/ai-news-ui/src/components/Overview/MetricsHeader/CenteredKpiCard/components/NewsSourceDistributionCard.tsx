import type { MetaDataDistribution } from '@/shared/types/analysis/macro_pulse/MetaDataDistribution.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { Box, Stack, Group, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import {
  NEWS_SOURCES_NAMES,
  NEWS_SOURCES_COLORS,
  NEWS_SOURCES_FULL_NAMES,
} from '@/shared/constants/NewsSources.ts';
import type { SourceDistributionOverview } from '@/shared/types/analysis/dashboard/MacroPulse.ts';

interface NewsSourceDistributionCardProps {
  height?: number | string;
  data: SourceDistributionOverview;
}
const NewsSourceDistributionCard = ({ data, height = 350 }:NewsSourceDistributionCardProps) => {
  const totalValue = data.reduce(
    (total, source) => total + source.newsCount,
    0,
  );

  const sortedData = [...data].sort((a, b) => b.newsCount - a.newsCount);
  const names = sortedData.map((item) => NEWS_SOURCES_NAMES[item.name]);

  const chartOption = useMemo<EChartsOption>(() => {
    const data = sortedData.map((item) => ({
      name: NEWS_SOURCES_NAMES[item.name] ?? item.name,
      value: item.newsCount,
      itemStyle: {
        color: NEWS_SOURCES_COLORS[item.name],
      },
    }));

    return {
      grid: {
        left: 50,
        right: 30,
        top: 10,
        bottom: 20,
      },

      xAxis: {
        type: 'value',
        name: 'Articles',
      },

      yAxis: {
        type: 'category',
        data: data.map((item) => item.name),
        inverse: true,
        axisLabel: {
          fontSize: 11,
        },
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const item = params[0];
          const source = sortedData[item.dataIndex];

          return `
          <strong>${NEWS_SOURCES_FULL_NAMES[source.name] ?? source.name}</strong>
          <br />
          ${source.newsCount.toLocaleString()} articles
        `;
        },
      },

      series: [
        {
          type: 'bar',
          data: data,
          barMaxWidth: 24,

          label: {
            show: true,
            position: 'right',
            color: '#495057',
            fontWeight: 600,
            formatter: (params: any) => Number(params.value).toLocaleString(),
          },
        },
      ],
    };
  }, [sortedData]);

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