import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { Box, Group, Text, Stack } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import {NEWS_ENTITY_COLORS} from '@/shared/constants/NewsEntities.ts';
import type { EntityTypeDistributionOverview } from '@/shared/types/analysis/dashboard/MacroPulse.ts';

interface EntityTypeBreakdownCardProps {
  height?: number | string;
  data: EntityTypeDistributionOverview;
}

const EntityTypeBreakdownCard = ({
  data,
  height = 300,
}: EntityTypeBreakdownCardProps) => {
  const totalValue = data.reduce(
    (total, source) => total + source.entityCount,
    0,
  );

  const sortedData = [...data].sort((a, b) => b.entityCount - a.entityCount);
  const names = sortedData.map((item) => item.name);

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
            value: item.entityCount,
            itemStyle: {
              color: NEWS_ENTITY_COLORS[item.name],
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
      <Box h={height} w='100%'>
        <Group justify='space-between' align='flex-end'>
          <Box>
            <Text size='xs' c='dimmed'>
              Total entries
            </Text>

            <Text fw={700} size='xl'>
              {totalValue.toLocaleString()}
            </Text>
          </Box>

          <Text size='xs' c='dimmed'>
            {data.length} types
          </Text>
        </Group>
        <EChartContainer option={chartOption} height={height} />
      </Box>
    </Stack>
  );
};

export default EntityTypeBreakdownCard;