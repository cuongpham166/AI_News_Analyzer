import React, { useMemo } from 'react';
import type { TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import {
  formatTimestamp,
  getSentimentDistributionData,
  type SentimentDistributionData,
} from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentDistributionChart/sentimentDistribution.utils.ts';
import {
  SENTIMENT_DISTRIBUTION_COLORS
} from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentDistributionChart/sentimentDistribution.config.ts';
import { Stack } from '@mantine/core';
import SentimentDistributionLegend
  from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentDistributionChart/components/SentimentDistributionLegend.tsx';

interface SentimentDistributionChartProps {
  data: TimelineBucket[];
  height?: number | string;
}
const SentimentDistributionChart = ({
  data,
  height = 420,
}: SentimentDistributionChartProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const sentimentDistributionData: SentimentDistributionData[] =
      getSentimentDistributionData(data);
    const dates = sentimentDistributionData.map(
      (item) => formatTimestamp(item.timestamp),
    );
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          const data = params[0].data;

          return `
            <strong>${formatTimestamp(data.timestamp)}</strong><br/>
            <span style="color:#3BA272">●</span>
            Positive: ${data.positive} articles (${data.positivePercent}%)<br/>
            <span style="color:#EE6666">●</span>
            Negative: ${data.negative} articles (${data.negativePercent}%)<br/>
            <strong>Total:</strong> ${data.total} articles
          `;
        },
      },
      grid: {
        left: 20,
        right: 20,
        bottom: 60,
        containLabel: true,
      },

      yAxis: {
        type: 'category',
        data: dates,
      },

      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
        },
      },

      series: [
        {
          name: 'Positive',
          type: 'bar',
          stack: 'sentiment',
          itemStyle: {
            color: SENTIMENT_DISTRIBUTION_COLORS['positive'],
          },
          data: sentimentDistributionData.map((item) => ({
            value: item.positivePercent,
            ...item,
          })),
        },
        {
          name: 'Negative',
          type: 'bar',
          stack: 'sentiment',
          itemStyle: {
            color: SENTIMENT_DISTRIBUTION_COLORS['negative'],
          },
          data: sentimentDistributionData.map((item) => ({
            value: item.negativePercent,
            ...item,
          })),
        },
      ],

      label: {
        show: true,
        position: 'inside',
        formatter: (params: any) => {
          return `${params.value}%`;
        },
      },
    };
  }, [data]);
  return <Stack><EChartContainer option={chartOption} height={height} /><SentimentDistributionLegend/></Stack>;
};

export default SentimentDistributionChart;
