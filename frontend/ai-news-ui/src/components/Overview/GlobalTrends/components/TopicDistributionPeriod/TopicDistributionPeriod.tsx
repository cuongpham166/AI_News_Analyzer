import React, { useMemo } from 'react';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import type { TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import type {
  GlobalTimelineBucket,
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';
import {
  NEWS_TOPIC_COLORS,
  NEWS_TOPICS,
} from '@/shared/constants/NewsTopics.ts';
import {
  formatDate,
  getGlobalTrendsData,
} from './topicDistributionPeriod.utils.ts';
import { Box, Flex } from '@mantine/core';
import DashboardSection from '@/components/generic/DashboardSection';
import GlobalTrendLegend from '@/components/Overview/GlobalTrends/components/GlobalTrendLegend.tsx';
import { createDataZoom, GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';

interface TopicDistributionPeriodProps {
  data: GlobalTimelineBucket[];
  height?: number | string;
}

const TopicDistributionPeriod = ({
  data,
  height = 500,
}: TopicDistributionPeriodProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const { counts, percentages } = getGlobalTrendsData(data);
    const dates = data.map((item) => formatDate(item.date));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params) => {
          const monthIndex = params[0].dataIndex;
          const month = params[0].axisValue;
          let totalArticles = 0;
          const customContent = params
            .map((item) => {
              const count = counts[item.seriesIndex][monthIndex];

              if (count <= 0) return '';

              const percentage = (item.value * 100).toFixed(1);
              totalArticles += count;
              const topicName =
                item.seriesName.charAt(0).toUpperCase() +
                item.seriesName.slice(1);

              return `
                <div style="
                  display:flex;
                  justify-content:space-between;
                  gap:12px;
                  margin-bottom:5px;
                ">
                  <span style="color:#475569;">
                    ${item.marker}
                    ${escapeHtml(topicName)}
                  </span>
                  <strong style="text-align:right;white-space:nowrap;">
                    ${count} articles
                    <span style="color:#64748B;font-weight:400;">
                      (${percentage}%)
                    </span>
                  </strong>
                </div>
              `;
            })
            .join('');

          return createCustomChartTooltip({
            title: month,
            minWidth: 260,
            customContent: `
              ${
                customContent ||
                '<span style="color:#64748B;">No topic data available</span>'
              }
        
              <div style="
                border-top:1px solid #F1F5F9;
                margin-top:8px;
                padding-top:6px;
                display:flex;
                justify-content:space-between;
              ">
                <strong>Total articles:</strong>
                <strong>${totalArticles}</strong>
              </div>
            `,
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
        max: 1,
        axisLabel: {
          formatter: (value: number) => `${Math.round(value * 100)}%`,
        },
      },

      dataZoom: createDataZoom('y'),

      series: NEWS_TOPICS.map((topic, index) => ({
        name: topic,
        type: 'bar',
        stack: 'total',
        barWidth: '60%',
        itemStyle: {
          color: NEWS_TOPIC_COLORS[topic],
        },
        data: percentages[index],

        label: {
          show: true,
          position: 'inside',
          formatter: (params: any) => {
            const value = params.value;
            if (value < 0.03) {
              return '';
            }

            return `${Math.round(value * 100)}%`;
          },
        },
      })),
    };
  }, [data]);

  return (
    <DashboardSection
      title='Topic Distribution by Period'
      description='Compare how global coverage is distributed across topics over time'
      children={
        <Flex direction='column' h='100%' gap='sm'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            <EChartContainer option={chartOption} height={height} />
          </Box>
          <GlobalTrendLegend />
        </Flex>
      }
    />
  );
};

export default TopicDistributionPeriod;
