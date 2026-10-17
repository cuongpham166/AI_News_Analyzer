import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import {
  buildConnectionSentimentChartTooltip,
  getConnectionSentimentData,
  TOP_N_OPTIONS,
} from './connectionSentiment.utils.ts';
import { Box, Flex, Group, Select, Stack, Text } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

interface ConnectionSentimentProps {
  powerCouple?: PowerCouple[];
  height?: number | string;
}

export interface ConnectionSentimentData extends PowerCouple {
  label: string;
}

const ConnectionSentiment = ({
  powerCouple, height = 420,
}: ConnectionSentimentProps) => {
  const [limit, setLimit] = useState('10');

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
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',
        formatter: (params: any) => {
          const data = connectionSentimentData[params.dataIndex];
          return buildConnectionSentimentChartTooltip(data);
        },
      },

      grid: {
        top: 20,
        right: 50,
        bottom: 45,
        left: 20,
        containLabel: true,
      },

      xAxis: {
        type: 'value',
        min: -1.0,
        max: 1.0,
        name: 'Joint Sentiment',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: '#64748B',
          fontSize: 12,
          fontWeight: 500,
        },
        axisLabel: {
          formatter: (value: number) =>
            value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1),
          color: '#475569',
          fontSize: 11,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#CBD5E1',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#F1F5F9',
          },
        },
      },

      yAxis: {
        type: 'category',
        data: connectionSentimentData.map((d) => d.label),
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          width: 150,
          overflow: 'truncate',
          ellipsis: '…',
          color: '#334155',
          fontSize: 12,
          fontWeight: 500,
        },
      },

      series: [
        {
          type: 'bar',
          data: connectionSentimentData.map((d) => {
            const val = d.avgSentiment;
            const isPositive = val >= 0;

            return {
              value: val,
              itemStyle: {
                color: isPositive
                  ? NEWS_SENTIMENT_COLORS['positive']
                  : NEWS_SENTIMENT_COLORS['negative'],
                borderRadius: isPositive ? [0, 4, 4, 0] : [4, 0, 0, 4],
              },
            };
          }),
          barMaxWidth: 18,

          label: {
            show: true,
            position: 'right', // All sentiment numbers placed strictly on the right
            distance: 6,
            formatter: (params: any) => {
              const val = Number(params.value);
              return val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2);
            },
            color: '#1E293B',
            fontSize: 11,
            fontWeight: 600,
          },

          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 6,
              shadowColor: 'rgba(0, 0, 0, 0.15)',
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
