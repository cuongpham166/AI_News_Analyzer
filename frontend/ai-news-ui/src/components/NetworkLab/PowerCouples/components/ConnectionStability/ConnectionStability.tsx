import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/PowerCouple.ts';
import {getConnectionStabilityData} from './connectionStability.utils.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';

interface ConnectionStabilityProps {
  data: PowerCouple[];
  height?: number | string;
}

const ConnectionStability = ({ data, height = 420 }:ConnectionStabilityProps) => {
  const connectionStabilityData = getConnectionStabilityData(data);
  const chartOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        formatter: ({ data }) => {
          return `
        <strong>${data.person}</strong><br/>
        ${data.organization}<br/>
        Sentiment: ${data.value[0].toFixed(2)}<br/>
        Volatility: ${data.value[1].toFixed(2)}
      `;
        },
      },
      grid: {
        left: 60,
        right: 30,
        top: 30,
        bottom: 60,
      },

      xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'Avg. sentiment',
      },

      yAxis: {
        type: 'value',
        name: 'Volatility',
      },

      series: [
        {
          type: 'scatter',
          symbolSize: 12,
          data: connectionStabilityData,
        },
      ],
    };
  }, [connectionStabilityData]);

  return (
    <DashboardSection
      title='Connection stability'
      description='Compare sentiment and volatility to identify consistent and unpredictable relationships.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default ConnectionStability;
