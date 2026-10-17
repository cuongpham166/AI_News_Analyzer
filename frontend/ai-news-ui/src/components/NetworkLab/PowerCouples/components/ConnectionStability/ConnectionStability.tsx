import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import {
  buildConnectionStabilityChartTooltip,
  type ConnectionStabilityNode,
  getConnectionStabilityData,
} from './connectionStability.utils.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import { createDataZoom } from '@/shared/utils/chartConfig.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface ConnectionStabilityProps {
  powerCouple?: PowerCouple[];
  height?: number | string;
}

const ConnectionStability = ({
  powerCouple,
  height = 420,
}: ConnectionStabilityProps) => {
  const hasData = Boolean(powerCouple && powerCouple.length > 0);

  const connectionStabilityData = useMemo(() => {
    if (!hasData || !powerCouple) return [];
    return getConnectionStabilityData(powerCouple);
  }, [powerCouple, hasData]);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !connectionStabilityData.length) {
      return undefined;
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
          const data = params.data as ConnectionStabilityNode;
          return buildConnectionStabilityChartTooltip(data);
        },
      },

      grid: {
        top: 30,
        right: 30,
        bottom: 55,
        left: 30,
        containLabel: true,
      },

      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'none',
        },
      ],
      xAxis: {
        type: 'value',
        min: -1.0,
        max: 1.0,
        name: 'Avg. Sentiment',
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
        type: 'value',
        name: 'Volatility',
        nameTextStyle: {
          color: '#64748B',
          fontSize: 12,
          fontWeight: 500,
        },
        axisLabel: {
          formatter: (value: number) => value.toFixed(2),
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

      series: [
        {
          type: 'scatter',
          data: connectionStabilityData,
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
      ],
    };
  }, [connectionStabilityData, hasData]);

  return (
    <DashboardSection
      title='Connection stability'
      description='Compare sentiment and volatility to identify consistent and unpredictable relationships.'
      children={
        <Flex direction='column' h='100%' gap='sm'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No data were found.'
              />
            )}
          </Box>
        </Flex>
      }
    />
  );
};

export default ConnectionStability;
