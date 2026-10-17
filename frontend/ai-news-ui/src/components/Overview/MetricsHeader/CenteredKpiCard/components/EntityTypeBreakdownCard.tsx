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
  height = 350,
}: EntityTypeBreakdownCardProps) => {
  const totalValue = data.reduce(
    (total, source) => total + source.entityCount,
    0,
  );

  const sortedData = [...data].sort((a, b) => b.entityCount - a.entityCount);
  const names = sortedData.map((item) => item.name);

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
            value: item.entityCount,
            itemStyle: {
              color: NEWS_ENTITY_COLORS[item.name],
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