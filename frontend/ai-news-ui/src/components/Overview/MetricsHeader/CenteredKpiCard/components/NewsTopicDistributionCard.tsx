import type { MetaDataDistribution } from '@/shared/types/analysis/macro_pulse/MetaDataDistribution.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { Box, Group, Stack, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import {NEWS_TOPIC_COLORS} from '@/shared/constants/NewsTopics.ts';
import type { TopicDistributionOverview } from '@/shared/types/analysis/dashboard/MacroPulse.ts';

interface NewsTopicDistributionCardProps {
  height?: number | string;
  data: TopicDistributionOverview;
}

const NewsTopicDistributionCard = ({ data, height = 350
}:NewsTopicDistributionCardProps) => {
  const totalValue = data.reduce(
    (total, source) => total + source.newsCount,
    0,
  );

  const sortedData = [...data].sort((a, b) => b.newsCount - a.newsCount);
  const names = sortedData.map((item)=>item.name);

  const chartOption = useMemo<EChartsOption>(() => {
    return {
      grid: {
        left: 50,
        right: 30,
        top: 10,
        bottom: 20,
      },

      yAxis: {
        type: 'category',
        data: names,
        inverse: true,
        axisLabel: {
          interval: 0,
          fontSize: 11,
          formatter: (value: string) =>
            value.charAt(0).toUpperCase() + value.slice(1),
        },
        axisTick: {
          alignWithLabel: true,
        },
      },

      xAxis: {
        type: 'value',
        name: 'Articles',
      },

      series: [
        {
          encode: { x: 'mentions', y: 'topic' },
          data: sortedData.map((item) => ({
            value: item.newsCount,
            itemStyle: {
              color: NEWS_TOPIC_COLORS[item.name],
            },
          })),
          type: 'bar',
          label: {
            show: true,
            position: 'right',
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
          {data.length} topics
        </Text>
      </Group>
      <Box h={height} w='100%'>
        <EChartContainer option={chartOption} height={height} />
      </Box>
    </Stack>
  );
};

export default NewsTopicDistributionCard