import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import React, { useMemo } from 'react';
import type {
  GlobalTimelineBucket,
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';
import { getTopicShareData } from '@/components/Overview/GlobalTrends/components/TopicShare/topicShare.utils.ts';
import type { EChartsOption } from 'echarts';
import { NEWS_TOPIC_COLORS } from '@/shared/constants/NewsTopics.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import GlobalTrendLegend from '@/components/Overview/GlobalTrends/components/GlobalTrendLegend.tsx';
import { createDataZoom } from '@/shared/utils/chartConfig.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';

interface TopicShareProps {
  data: GlobalTimelineBucket[];
  height?: number | string;
}


const TopicShare = ({ data, height = 450 }:TopicShareProps) => {
  const topicShareData = getTopicShareData(data);
  const chartOption = useMemo<EChartsOption>(() => {
    const topics = [
      ...new Set(topicShareData.flatMap((item) => Object.keys(item.topics))),
    ];

    const topicSeries = topics.map((topic) => {
      const color = NEWS_TOPIC_COLORS[topic] ?? '#94A3B8';

      return {
        name: topic,
        type: 'line',
        stack: 'share',
        smooth: true,
        symbol: 'none',

        lineStyle: {
          color,
          width: 1,
        },

        areaStyle: {
          color,
          opacity: 0.85,
        },

        itemStyle: {
          color,
        },

        emphasis: {
          focus: 'series',
        },

        data: topicShareData.map((item) => item.topics[topic] ?? 0),
      };
    });
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) {
            return '';
          }

          const date = String(params[0].axisValue);

          const topics = params
            .map((item: any) => ({
              name: String(item.seriesName),
              value: Number(item.value) || 0,
              marker: item.marker,
            }))
            .filter((item: { value: number }) => item.value > 0)
            .sort(
              (a: { value: number }, b: { value: number }) => b.value - a.value,
            );

          const totalShare = topics.reduce(
            (sum: number, topic: { value: number }) => sum + topic.value,
            0,
          );

          const topicRows = topics
            .map(
              (topic: { name: string; value: number; marker: string }) => `
          <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:12px;
            margin-bottom:5px;
          ">
            <span style="
              display:flex;
              align-items:center;
              gap:5px;
              color:#475569;
            ">
              ${topic.marker}
              ${escapeHtml(
                topic.name.charAt(0).toUpperCase() + topic.name.slice(1),
              )}
            </span>

            <strong style="white-space:nowrap;">
              ${topic.value.toFixed(1)}%
            </strong>
          </div>
        `,
            )
            .join('');

          return createCustomChartTooltip({
            title: date,
            minWidth: 250,

            customContent: `
        ${
          topicRows ||
          '<span style="color:#64748B;">No topic share data available</span>'
        }

        <div style="
          border-top:1px solid #F1F5F9;
          margin-top:8px;
          padding-top:8px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        ">
          <strong>Total share</strong>
          <strong>${totalShare.toFixed(1)}%</strong>
        </div>
      `,
          });
        },
      },

      grid: {
        top: 10,
        left: 20,
        right: 20,
        bottom: 40,
        containLabel: true,
      },

      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: topicShareData.map((item) => item.date),
      },

      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: '{value}%',
        },
      },

      dataZoom: createDataZoom('x'),

      series: topicSeries,
    };
  }, [topicShareData]);
  return (
    <DashboardSection
      title='Shifting Topic Share'
      description='Compare the relative share of top topics and discover changes in global coverage.'
    >
      <Flex direction='column' h='100%' gap='sm'>
        <Box style={{ flex: 1, minHeight: 0 }}>
          <EChartContainer option={chartOption} height={height} />
        </Box>
          <GlobalTrendLegend />
      </Flex>
    </DashboardSection>
  );
};

export default TopicShare;
