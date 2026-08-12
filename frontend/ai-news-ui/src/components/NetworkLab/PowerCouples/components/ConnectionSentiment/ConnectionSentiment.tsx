import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/PowerCouple.ts';
import {getConnectionSentimentData} from './connectionSentiment.utils.ts';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

interface ConnectionSentimentProps {
  data: PowerCouple[];
  height?: number | string;
}

const ConnectionSentiment = ({ data, height = 420 }:ConnectionSentimentProps) => {
  const connectionSentimentData = getConnectionSentimentData(data);
  const chartOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const p = params[0];
          return `${p.name}<br/>Sentiment: ${p.value.toFixed(2)}`;
        },
      },

      grid: {
        left: 280,
        right: 30,
        top: 20,
        bottom: 30,
      },

      xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'Sentiment',
      },

      yAxis: {
        type: 'category',
        data: connectionSentimentData.map((d) => d.name),
        inverse: true,
      },

      series: [
        {
          type: 'bar',
          data: connectionSentimentData.map((d) => d.value),
          barMaxWidth: 18,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
          },
        },
      ],
    };
  }, [connectionSentimentData]);
  return (
    <DashboardSection
      title='Connection sentiment'
      description='See which relationships are associated with the most positive sentiment.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default ConnectionSentiment;
