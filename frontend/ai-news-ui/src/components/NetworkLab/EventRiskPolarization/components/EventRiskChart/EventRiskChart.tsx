import type { EventRisk } from '@/shared/types/analysis/network_lab/EventRisk.ts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import {getVolatilityColor} from './eventRisk.utils.ts';
import EventRiskLegend from '@/components/NetworkLab/EventRiskPolarization/components/EventRiskChart/components';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface EventRiskChartProps {
  eventRisk?: EventRisk[];
  height?: number | string;
  limit:string;
}
const EventRiskChart = ({
  limit,
  eventRisk,
  height = 500,
}: EventRiskChartProps) => {
  const hasData = eventRisk && eventRisk.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }
    const chartData = eventRisk
      .sort((a, b) => b.frequency - a.frequency || b.volatility - a.volatility)
      .slice(0,Number(limit))

    const maxVolatility = Math.max(...chartData.map((d) => d.volatility), 0.01);

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const item = chartData[params.dataIndex];

          return `
        <strong>${item.event}</strong><br/>
        Coverage: ${item.frequency}<br/>
        Avg. sentiment: ${item.avgSentiment.toFixed(2)}<br/>
        Volatility: ${item.volatility.toFixed(2)}
      `;
        },
      },
      grid: GRID_CONFIG,

      xAxis: {
        type: 'value',
        min: 0,
        max: Math.max(...chartData.map((d) => d.frequency)) + 0.5,
        name: 'Coverage',
        splitLine: {
          lineStyle: {
            color: '#e5e7eb',
          },
        },
      },

      yAxis: {
        type: 'category',
        data: chartData.map((d) => d.event),
        inverse: true,
        axisLine: { show: false },
        axisTick: { show: false },
      },

      series: [
        {
          type: 'bar',
          data: chartData.map((d) => d.frequency),
          barWidth: 2,
          itemStyle: {
            color: '#cbd5e1',
          },
          silent: true,
          z: 1,
        },

        {
          type: 'scatter',
          data: chartData.map((d, index) => ({
            value: [d.frequency, index],
            event: d.event,
            frequency: d.frequency,
            avgSentiment: d.avgSentiment,
            volatility: d.volatility,
          })),
          symbolSize: (params: any) => {
            const volatility = params.data?.volatility ?? 0;
            return 12 + (volatility / maxVolatility) * 10;
          },

          itemStyle: {
            color: (params: any) =>
              getVolatilityColor(params.data?.volatility ?? 0),
          },
          z: 3,
        },
      ],
    };
  }, [eventRisk, hasData, limit]);

  return (
    <DashboardSection
      children={
        <Flex direction='column' h='100%'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No event risk data were found.'
              />
            )}
          </Box>
          <EventRiskLegend />
        </Flex>
      }
    />
  );
};


export default EventRiskChart;