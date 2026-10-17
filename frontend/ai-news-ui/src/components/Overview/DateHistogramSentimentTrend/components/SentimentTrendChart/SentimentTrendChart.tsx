import React, { useMemo } from 'react';
import type {
  DateHistogramSentimentTrendType,
  TimelineBucket,
} from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import {
  formatTimestamp,
  getSentimentTrendData,
  type SentimentTrendData,
} from './sentimentTrend.utils.ts';
import { Box } from '@mantine/core';
import DashboardSection from '@/components/generic/DashboardSection';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

interface SentimentTrendChartProps {
  data?: DateHistogramSentimentTrendType;
  height?: number | string;
}

const SentimentTrendChart = ({
  data,
  height = 500,
}: SentimentTrendChartProps) => {
  const hasData =
    data?.timeline !== null &&
    data?.timeline !== undefined &&
    data.timeline.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !data) {
      return undefined;
    }

    const activeBuckets = data.timeline.filter(
      (timeline) => timeline.articleCount > 0,
    );

    const dates = activeBuckets.map((item) => formatTimestamp(item.timestamp));
    const sentimentSeries = activeBuckets.map((item) => item.averageSentiment);
    const volumeSeries = activeBuckets.map((item) => item.articleCount);

    return {
      grid: {
        top: 80,
        bottom: 70,
        left: 20,
        right: 60,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', crossStyle: { color: '#9CA3AF' } },
        padding: [10, 14],
        formatter: (params: any) => {
          if (!params || !params.length) return '';
          const dataIndex = params[0].dataIndex;
          const bucket = activeBuckets[dataIndex];
          const formattedDate = dates[dataIndex];
          const breakdown = bucket.sentimentBreakdown || {};

          const posCount = breakdown['POSITIVE'] || breakdown['positive'] || 0;
          const negCount = breakdown['NEGATIVE'] || breakdown['negative'] || 0;
          const total = posCount + negCount;
          return createCustomChartTooltip({
            title: formattedDate,

            metrics: [
              {
                label: 'Positive Articles',
                value: `${posCount}`,
                color: NEWS_SENTIMENT_COLORS['positive'],
              },
              {
                label: 'Negative Articles',
                value: `${negCount}`,
                color: NEWS_SENTIMENT_COLORS['negative'],
              },
              {
                label: 'Total Articles',
                value: `${total}`,
              },
            ],

            distribution: {
              segments: [
                {
                  label: 'Pos',
                  percentage: total > 0 ? (posCount / total) * 100 : 0,
                  color: NEWS_SENTIMENT_COLORS['positive'],
                },
                {
                  label: 'Conflict',
                  percentage: total > 0 ? (negCount / total) * 100 : 0,
                  color: NEWS_SENTIMENT_COLORS['negative'],
                },
              ],
            },
          });
        },
      },
      legend: {
        data: ['Article Volume', 'Average Sentiment'],
        top: 10,
        right: 10,
      },
      dataZoom: [
        { type: 'inside', xAxisIndex: 0, filterMode: 'empty' },
        { type: 'slider', xAxisIndex: 0, bottom: 15, filterMode: 'empty' },
      ],
      xAxis: {
        type: 'category',
        data: dates,
        axisPointer: { type: 'shadow' },
        axisLine: { lineStyle: { color: '#9CA3AF' } },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Article Volume',
          position: 'left',
          splitLine: { lineStyle: { color: '#F3F4F6' } },
          axisLine: { lineStyle: { color: '#b2b6c1' } },
        },
        {
          type: 'value',
          name: 'Average Sentiment',
          position: 'right',
          min: -1.0,
          max: 1.0,
          splitLine: { show: false },
          axisLine: { lineStyle: { color: '#9CA3AF' } },
        },
      ],
      series: [
        {
          name: 'Article Volume',
          type: 'bar',
          yAxisIndex: 0,
          data: volumeSeries,
          itemStyle: {
            color: 'rgb(194 201 211 / 0.6)',
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: 'Average Sentiment',
          type: 'line',
          yAxisIndex: 1,
          data: sentimentSeries,
          smooth: true,
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#3B82F6',
          },
          itemStyle: { color: '#2563EB' },
          markLine: {
            silent: true,
            symbol: 'none',
            label: {
              formatter: 'Neutral (0.0)',
              position: 'end',
              fontSize: 10,
            },
            lineStyle: { type: 'dashed', color: '#9CA3AF', width: 1 },
            data: [{ yAxis: 0 }],
          },
        },
      ],
    };
  }, [data, hasData]);
  return (
    <DashboardSection
      title='Sentiment Trend'
      description='Shows sentiment changes over time.'
      children={
        <Box style={{ flex: 1, minHeight: 0 }}>
          {hasData && chartOption ? (
            <EChartContainer option={chartOption} height={height} />
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No trending data were found for this selection.'
            />
          )}
        </Box>
      }
    />
  );
};

export default SentimentTrendChart;