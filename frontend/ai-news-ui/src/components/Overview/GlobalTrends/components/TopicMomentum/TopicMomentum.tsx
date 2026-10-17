import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import React, { useMemo } from 'react';
import type {
  GlobalTimelineBucket,
  GlobalTrendType,
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalTrendsType.ts';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import { NEWS_TOPIC_COLORS } from '@/shared/constants/NewsTopics.ts';
import {
  getTopicMomentumData,
  type TopicMomentumPoint,
} from '@/components/Overview/GlobalTrends/components/TopicMomentum/topicMomentum.utils.ts';
import GlobalTrendLegend from '@/components/Overview/GlobalTrends/components/GlobalTrendLegend.tsx';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';

interface TopicMomentumProps {
  data: GlobalTimelineBucket[];
  height?: number | string;
}

const TopicMomentum = ({ data, height = 500 }: TopicMomentumProps) => {
  const topicMomentumData = getTopicMomentumData(data);
  const chartOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const item = params.data as TopicMomentumPoint;

          if (!item || !item.topic) {
            return '';
          }

          const topicName =
            item.topic.charAt(0).toUpperCase() + item.topic.slice(1);

          const positiveColor = NEWS_SENTIMENT_COLORS['positive'];
          const negativeColor = NEWS_SENTIMENT_COLORS['negative'];
          const neutralColor = '#64748B';

          const growthColor =
            item.growthRate === null
              ? neutralColor
              : item.growthRate > 0
                ? positiveColor
                : item.growthRate < 0
                  ? negativeColor
                  : neutralColor;

          const growthLabel = item.isNew
            ? 'New topic'
            : item.growthRate === null
              ? 'N/A'
              : `${item.growthRate > 0 ? '+' : ''}${item.growthRate.toFixed(1)}%`;

          const row = (
            label: string,
            value: string | number,
            color = '#0F172A',
          ) => `
            <div style="
              display:flex;
              justify-content:space-between;
              align-items:baseline;
              gap:16px;
              margin-bottom:5px;
            ">
              <span style="color:#64748B;">
                ${label}
              </span>
              <strong style="color:${color};text-align:right;">
                ${value}
              </strong>
            </div>
            `;

          const customContent = `
            ${row('Current Volume', item.currentValue)}
            ${row('Previous Volume', item.previousValue)}
            ${row('Growth Rate', growthLabel, growthColor)}
            ${row('Article Share', `${item.share.toFixed(1)}%`)}
      
            ${
              item.isNew
                ? `
                  <div style="
                    margin-top:8px;
                    padding:6px 8px;
                    border-radius:4px;
                    background:#F1F5F9;
                    color:#475569;
                    font-size:11px;
                  ">
                    This topic has appeared in the current period.
                  </div>
                `
                : ''
            }
        `;

          return createCustomChartTooltip({
            title: topicName,
            badge: item.isNew ? 'NEW' : undefined,
            badgeBgColor: '#2563EB',
            minWidth: 250,
            customContent,
          });
        },
      },

      grid: {
        top: 30,
        right: 30,
        bottom: 50,
        left: 60,
        containLabel: true,
      },

      xAxis: {
        type: 'value',
        name: 'Current volume',
        min: 0,
      },

      yAxis: {
        type: 'value',
        name: 'Growth rate',
        axisLabel: {
          formatter: '{value}%',
        },
      },

      series: [
        {
          type: 'scatter',

          data: topicMomentumData.map((item) => ({
            ...item,

            // [x, y]
            value: [item.currentValue, item.growthRate ?? 0],

            symbolSize: Math.max(20, Math.sqrt(item.share) * 10),

            itemStyle: {
              color: NEWS_TOPIC_COLORS[item.topic] ?? '#94A3B8',
              opacity: 0.8,
            },
          })),

          label: {
            show: true,
            formatter: '{@[2]}',
          },

          emphasis: {
            focus: 'series',
            label: {
              show: true,
            },
          },
        },
      ],
    };
  }, [topicMomentumData]);

  return (
    <DashboardSection
      title='Emerging Topic Momentum'
      description='Identify fast-growing topics and compare their momentum with current coverage volume.'
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

export default TopicMomentum;
