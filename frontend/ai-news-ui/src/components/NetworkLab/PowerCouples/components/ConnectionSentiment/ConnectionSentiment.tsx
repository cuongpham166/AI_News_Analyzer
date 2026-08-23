import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import {
  buildChartTooltip,
  getConnectionSentimentData,
  TOP_N_OPTIONS,
} from './connectionSentiment.utils.ts';
import { Box, Flex, Group, Select, Stack, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

interface ConnectionSentimentProps {
  powerCouple?: PowerCouple[];
  height?: number | string;
}

const ConnectionSentiment = ({
  powerCouple, height = 420,
}: ConnectionSentimentProps) => {
  const [limit, setLimit] = useState('10');

  const hasData = Boolean(powerCouple?.length);

  const connectionSentimentData = useMemo(
    () => getConnectionSentimentData(powerCouple ?? [], Number(limit)),
    [powerCouple, limit],
  );

  const chartOption = useMemo<EChartsOption>(() => {
    if (!connectionSentimentData.length) {
      return {};
    }

    return {
      animation: true,

      tooltip: {
        trigger: 'item',
        confine: true,

        formatter: (params: any) => {
          const data = connectionSentimentData[params.dataIndex];
          return buildChartTooltip(data);
        },
      },

      grid: {
        top: 20,
        right: 30,
        bottom: 40,
        left: 20,
        containLabel: true,
      },

      xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'Joint sentiment',
        nameLocation: 'middle',
        nameGap: 32,
        axisLabel: {
          formatter: (value: number) => (value > 0 ? `${value}` : `${value}`),
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#D1D5DB',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E5E7EB',
          },
        },
      },

      yAxis: {
        type: 'category',
        data: connectionSentimentData.map((d) => d.person),
        inverse: true,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          width: 100,
          overflow: 'truncate',
          ellipsis: '…',
          color: '#374151',
        },
      },
      series: [
        {
          type: 'bar',
          data: connectionSentimentData.map((d) => ({
            value: d.value,
            itemStyle: {
              borderRadius: d.value >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4],
            },
          })),
          barMaxWidth: 20,

          label: {
            show: true,
            position: 'right',
            formatter: (params: any) => Number(params.value),
            color: '#374151',
            fontWeight: 600,
          },

          emphasis: {
            focus: 'series',

            itemStyle: {
              shadowBlur: 8,
              shadowColor: 'rgba(0, 0, 0, 0.18)',
            },
          },
        },
      ],
    };
  }, [connectionSentimentData]);

  if (!powerCouple?.length) {
    return (
      <Stack gap='md'>
        <Text size='sm' c='dimmed' ta='center' py='xl'>
          No person–organization connection sentiment data available.
        </Text>
      </Stack>
    );
  }
  return (
    <DashboardSection
      title='Connection sentiment'
      description='See which relationships are associated with the most positive sentiment.'
      actions={
        <Group gap='sm'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            Show:
          </Text>
          <Select
            value={limit}
            onChange={(value) => setLimit(value ?? '10')}
            data={TOP_N_OPTIONS}
            w={120}
            allowDeselect={false}
          />
        </Group>
      }
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />

        </Flex>
      }
    />
  );
};

export default ConnectionSentiment;
