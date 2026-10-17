import React, { useMemo } from 'react';
import type {
  DateHistogramSentimentTrendType,
  TimelineBucket,
} from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import {
  formatTimestamp,
  getSentimentDistributionData,
  type SentimentDistributionData,
} from './sentimentDistribution.utils.ts';
import{ SENTIMENT_DISTRIBUTION_COLORS } from './sentimentDistribution.config.ts';
import { Box, Flex, Stack } from '@mantine/core';
import SentimentDistributionLegend  from './components/SentimentDistributionLegend.tsx';
import DashboardSection from '@/components/generic/DashboardSection';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { createDataZoom, GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import {createCustomChartTooltip} from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

interface SentimentDistributionChartProps {
  data?: DateHistogramSentimentTrendType;
  height?: number | string;
}
const SentimentDistributionChart = ({
  data,
  height = 420,
}: SentimentDistributionChartProps) => {
  const hasData =
    data?.timeline !== null &&
    data?.timeline !== undefined &&
    data.timeline.length > 0;

  const chartOption = useMemo<EChartsOption>(() => {

    if (!hasData) {
      return undefined;
    }
    const sentimentDistributionData: SentimentDistributionData[] = getSentimentDistributionData(data);
    const dates = sentimentDistributionData.map((item) =>formatTimestamp(item.timestamp));

      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: (params) => {
            const data = params[0].data;
            const total = Number(data.total) || 0;
            const positive = Number(data.positive) || 0;
            const negative = Number(data.negative) || 0;

            return createCustomChartTooltip({
              title: formatTimestamp(data.timestamp),

              metrics: [
                {
                  label: 'Positive Articles',
                  value: `${positive}`,
                  color: NEWS_SENTIMENT_COLORS['positive'],
                },
                {
                  label: 'Negative Articles',
                  value: `${negative}`,
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
                    percentage: total > 0 ? (positive / total) * 100 : 0,
                    color: NEWS_SENTIMENT_COLORS['positive'],
                  },
                  {
                    label: 'Conflict',
                    percentage: total > 0 ? (negative / total) * 100 : 0,
                    color: NEWS_SENTIMENT_COLORS['negative'],
                  },
                ],
              },
            });
          },
        },
        grid: GRID_CONFIG,

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

        dataZoom: createDataZoom('y'),

        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            return `${params.value}%`;
          },
        },
      };

  }, [data, hasData]);


  return (
    <DashboardSection
      title='Sentiment Distribution'
      description='Shows the distribution of sentiment categories.'
      children={
        <>
          {hasData && chartOption ? (
            <Flex direction='column' h='100%' gap='sm'>
              <Box style={{ flex: 1, minHeight: 0 }}>
                <EChartContainer option={chartOption} height={height} />
              </Box>
              <SentimentDistributionLegend/>
            </Flex>
          ) : (
            <Box style={{ flex: 1, minHeight: 0 }}>
              <EmptyDataCard
                title='No data available'
                description='No distribution data were found for this selection.'
              />
            </Box>
          )}
        </>
      }
    />
  );
};

export default SentimentDistributionChart;
