import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import React, { useMemo } from 'react';
import type {
  GlobalTimelineBucket,
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';
import {
  getTopicGrowthData,
  type TopicGrowthChartData,
} from './topicGrowth.utils.ts';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import {
  NEWS_TOPIC_COLORS,
} from '@/shared/constants/NewsTopics.ts';
import GlobalTrendLegend from '@/components/Overview/GlobalTrends/components/GlobalTrendLegend.tsx';
import { createDataZoom } from '@/shared/utils/chartConfig.ts';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

interface TopicGrowthProps {
  data: GlobalTimelineBucket[];
  height?: number | string;
}

const TopicGrowth = ({ data, height=450 }: TopicGrowthProps) => {
  const topicGrowthData: TopicGrowthChartData[] = getTopicGrowthData(data);
  const chartOption = useMemo<EChartsOption>(() => {
    const topics = [
      ...new Set(topicGrowthData.flatMap((item) => Object.keys(item.topics))),
    ];

    const topicSeries = topics.map((topic) => {
      const color = NEWS_TOPIC_COLORS[topic] ?? '#94A3B8';

      return {
        name: topic,
        type: 'line',
        stack: 'topics',
        smooth: true,
        symbol: 'none',

        lineStyle: {
          color,
          width: 1,
        },

        areaStyle: {
          color,
          opacity: 0.7,
        },

        itemStyle: {
          color,
        },

        emphasis: {
          focus: 'series',
        },

        data: topicGrowthData.map((item) => item.topics[topic] ?? 0),
      };
    });

    const totalSeries = {
      name: 'Total articles',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2,
      },
      z: 10,
      data: topicGrowthData.map((item) => item.articleCount),
    };
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params) => {
          if (!Array.isArray(params) || params.length === 0) {
            return '';
          }

          const monthIndex = params[0].dataIndex;
          const month = params[0].axisValue;

          const current = topicGrowthData[monthIndex];
          const previous = topicGrowthData[monthIndex - 1];

          const getChange = (currentValue: number, previousValue?: number) => {
            if (previousValue === undefined) {
              return {
                change: null,
                growth: null,
              };
            }

            return {
              change: currentValue - previousValue,
              growth:
                previousValue !== 0
                  ? ((currentValue - previousValue) / previousValue) * 100
                  : null,
            };
          };

          const formatChange = (change: number | null) => {
            if (change === null) return '—';
            if (change > 0) return `+${change}`;
            return String(change);
          };

          const formatGrowth = (growth: number | null) => {
            if (growth === null) return '—';
            return `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`;
          };

          const getChangeColor = (change: number | null) => {
            if (change === null || change === 0) return '#64748B';
            return change > 0
              ? NEWS_SENTIMENT_COLORS['positive']
              : NEWS_SENTIMENT_COLORS['negative'];
          };

          const topicContent = params
            .filter((item) => item.seriesName !== 'Total articles')
            .map((item) => {
              const topic = String(item.seriesName);
              const count = Number(item.value) || 0;
              const previousCount = previous?.topics[topic];

              const { change, growth } = getChange(count, previousCount);

              const color = NEWS_TOPIC_COLORS[topic] ?? '#94A3B8';

              return `
        <div style="
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          margin-bottom:6px;
        ">
          <span style="
            color:#475569;
            display:flex;
            align-items:center;
            gap:5px;
          ">
            ${item.marker}
            ${escapeHtml(topic.charAt(0).toUpperCase()+topic.slice(1))}
          </span>

          <div style="
            display:flex;
            align-items:center;
            gap:10px;
            text-align:right;
            white-space:nowrap;
          ">
            <strong>${count}</strong>

            <span style="
              min-width:44px;
              color:${getChangeColor(change)};
            ">
              ${formatChange(change)}
            </span>

            <span style="
              min-width:58px;
              color:${getChangeColor(change)};
            ">
              ${formatGrowth(growth)}
            </span>
          </div>
        </div>
      `;
            })
            .join('');

          const totalCount = current?.articleCount ?? 0;
          const previousTotal = previous?.articleCount;

          const totalChange = getChange(totalCount, previousTotal);

          return createCustomChartTooltip({
            title: String(month),
            minWidth: 340,
            customContent: `
      <div style="
        display:flex;
        justify-content:flex-end;
        gap:10px;
        color:#64748B;
        font-size:10px;
        margin-bottom:6px;
        padding-bottom:5px;
        border-bottom:1px solid #F1F5F9;
      ">
        <span style="min-width:44px;text-align:right;">Articles</span>
        <span style="min-width:44px;text-align:right;">Change</span>
        <span style="min-width:58px;text-align:right;">Growth</span>
      </div>

      ${
        topicContent ||
        '<span style="color:#64748B;">No topic data available</span>'
      }

      <div style="
        border-top:1px solid #F1F5F9;
        margin-top:8px;
        padding-top:8px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:12px;
      ">
        <strong>Total articles</strong>

        <div style="
          display:flex;
          gap:10px;
          text-align:right;
          white-space:nowrap;
        ">
          <strong style="min-width:44px;">${totalCount}</strong>

          <strong style="
            min-width:44px;
            color:${getChangeColor(totalChange.change)};
          ">
            ${formatChange(totalChange.change)}
          </strong>

          <strong style="
            min-width:58px;
            color:${getChangeColor(totalChange.change)};
          ">
            ${formatGrowth(totalChange.growth)}
          </strong>
        </div>
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
        data: topicGrowthData.map((item) => item.date),
      },

      yAxis: {
        type: 'value',
        name: 'Articles',
        min: 0,
      },

      dataZoom: createDataZoom('x'),

      series: [...topicSeries, totalSeries],
    };
  }, [topicGrowthData]);
  return (
    <DashboardSection
      title='Top Topics Over Time'
      description='Track article volume and identify the topics driving major changes in coverage.'
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

export default TopicGrowth;
