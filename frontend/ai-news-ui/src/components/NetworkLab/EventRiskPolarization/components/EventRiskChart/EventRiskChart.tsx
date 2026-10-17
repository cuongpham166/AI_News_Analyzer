import type { EventRisk } from '@/shared/types/analysis/network_lab/EventRisk.ts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EventRiskLegend from '@/components/NetworkLab/EventRiskPolarization/components/EventRiskChart/components';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {
  truncateLabel,
  buildEventRiskChartTooltip,
} from '@/components/NetworkLab/EventRiskPolarization/components/EventRiskChart/eventRisk.utils.ts';

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
  const hasData = Boolean(eventRisk && eventRisk.length > 0);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !eventRisk) {
      return undefined;
    }

    const parsedLimit = parseInt(limit, 10) || 10;

    const chartData = [...eventRisk]
      .sort((a, b) => b.frequency - a.frequency || b.riskScore - a.riskScore)
      .slice(0, parsedLimit);

    const eventLabels = chartData.map((d) => truncateLabel(d.event));

    return {
      animationDuration: 500,

      grid: {
        top: 0,
        right: 40,
        bottom: 0,
        left: 170,
        containLabel: false,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px;',
        formatter: (params: any[]) => buildEventRiskChartTooltip(chartData,params)
      },

      xAxis: {
        type: 'value',
        name: 'Articles Count',
        nameLocation: 'middle',
        nameGap: 28,
        min: 0,
        minInterval: 1,
        axisLabel: {
          color: '#64748B',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E2E8F0',
          },
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: eventLabels,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: '#334155',
          fontSize: 12,
          fontWeight: 500,
        },
      },

      series: [
        {
          name: 'Positive Volume',
          type: 'bar',
          stack: 'volume',
          data: chartData.map((d) => d.positiveVolume),
          barMaxWidth: 24,
          itemStyle: {
            color: NEWS_SENTIMENT_COLORS['positive'],
          },
        },
        {
          name: 'Negative Volume',
          type: 'bar',
          stack: 'volume',
          data: chartData.map((d) => d.negativeVolume),
          barMaxWidth: 24,
          itemStyle: {
            color: NEWS_SENTIMENT_COLORS["negative"],
            borderRadius: [0, 4, 4, 0],
          },
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