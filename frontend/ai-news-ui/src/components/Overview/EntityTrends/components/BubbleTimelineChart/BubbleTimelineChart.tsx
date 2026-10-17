import { Flex, Box } from '@mantine/core';
import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';

import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import DashboardSection from '@/components/generic/DashboardSection';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import type { GlobalEntitiesTrends } from '@/shared/types/analysis';
import { createDataZoom } from '@/shared/utils/chartConfig.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {createCustomChartTooltip} from '@/shared/utils/createChartTooltip.ts';
import {NEWS_ENTITY_COLORS} from "@/shared/constants/NewsEntities.ts";

interface BubbleTimelineChartProps {
  data?: GlobalEntitiesTrendsType;
  height?: number | string;
}

interface FlattenedBubbleItem {
  date: string;
  entity: string;
  type: string;
  count: number;
  averageSentiment: number;
  positiveVolume: number;
  negativeVolume: number;
  riskScore: number;
}


const getBubbleTimelineData = (
  data?: GlobalEntitiesTrends,
): FlattenedBubbleItem[] => {
  if (!data?.timeline) return [];

  const items: FlattenedBubbleItem[] = [];

  Object.entries(data.timeline).forEach(([date, entities]) => {
    entities.forEach((e) => {
      items.push({
        date,
        entity: e.name,
        type: e.type,
        count: e.count,
        averageSentiment: e.averageSentiment,
        positiveVolume: e.positiveVolume,
        negativeVolume: e.negativeVolume,
        riskScore: e.riskScore,
      });
    });
  });

  return items;
};

const BubbleTimelineChart = ({
  data,
  height = 500,
}: BubbleTimelineChartProps) => {
  const bubbleTimelineData = useMemo(() => getBubbleTimelineData(data), [data]);
  const hasData = bubbleTimelineData.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) return undefined;

    const dates = [
      ...new Set(bubbleTimelineData.map((item) => item.date)),
    ].sort();
    const entities = [
      ...new Set(bubbleTimelineData.map((item) => item.entity)),
    ];

    return {
      title: {
        left: 'left',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
        subtextStyle: { fontSize: 12, color: '#6B7280' },
      },
      dataZoom: createDataZoom('both'),
      grid: {
        top: 80,
        right: 150,
        bottom: 60,
        left: 0,
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        padding: [10, 14],
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#374151',
        textStyle: { color: '#F9FAFB', fontSize: 12 },
        formatter: (params: any) => {
          const raw = params.data;

          const [, , count, name, sentiment, riskScore, posVol, negVol, type] = raw;

          const dateStr = dates[raw[0]];

          const sentimentColors = {
            positive: NEWS_SENTIMENT_COLORS['positive'],
            negative: NEWS_SENTIMENT_COLORS['negative'],
            neutral: '#64748B',
          };

          const sentimentColor =
            sentiment > 0
              ? sentimentColors.positive
              : sentiment < 0
                ? sentimentColors.negative
                : sentimentColors.neutral;

          const total = Number(count) || 0;
          const positive = Number(posVol) || 0;
          const negative = Number(negVol) || 0;

          return createCustomChartTooltip({
            title: name,
            subtitle: `Date: ${dateStr}`,
            badge: String(type).toUpperCase(),
            badgeBgColor:NEWS_ENTITY_COLORS[type],
            colors: {
              ...sentimentColors,
              neutral: '#64748B',
            },

            metrics: [
              {
                label: 'Mentions',
                value: count,
              },
              {
                label: 'Risk Score',
                value: `${(riskScore * 100).toFixed(1)}%`,
                color:
                  riskScore > 0.4
                    ? sentimentColors.negative
                    : sentimentColors.positive,
              },
              {
                label: 'Avg Sentiment',
                value: `${sentiment > 0 ? '+' : ''}${sentiment.toFixed(2)}`,
                color: sentimentColor,
              },
              {
                label: 'Positive Articles',
                value: positive,
                color: sentimentColors.positive,
              },
              {
                label: 'Conflict Articles',
                value: negative,
                color: sentimentColors.negative,
              },
            ],

            distribution: {
              segments: [
                {
                  label: 'Pos',
                  percentage: total > 0 ? (positive / total) * 100 : 0,
                  color: sentimentColors.positive,
                },
                {
                  label: 'Conflict',
                  percentage: total > 0 ? (negative / total) * 100 : 0,
                  color: sentimentColors.negative,
                },
              ],
            },
          });
        },
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        axisLabel: { rotate: 30 },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#E5E7EB' },
        },
      },
      yAxis: {
        type: 'category',
        data: entities,
        inverse: true,
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed', color: '#E5E7EB' },
        },
      },
      visualMap: {
        min: -1.0,
        max: 1.0,
        dimension: 4,
        orient: 'vertical',
        right: 15,
        top: 'center',
        text: ['Positive Sentiment', 'Negative Sentiment'],
        calculable: true,
        inRange: {
          color: ['#EF4444', '#F59E0B', '#10B981'],
        },
        textStyle: { color: '#4B5563', fontSize: 11 },
      },
      series: [
        {
          name: 'Entity Mentions',
          type: 'scatter',
          emphasis: {
            scale: true,
            itemStyle: {
              borderColor: '#111827',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.3)',
            },
          },
          data: bubbleTimelineData.map((item) => [
            dates.indexOf(item.date),
            entities.indexOf(item.entity),
            item.count,
            item.entity,
            item.averageSentiment,
            item.riskScore,
            item.positiveVolume,
            item.negativeVolume,
            item.type,
          ]),
          symbolSize: (value: number[]) => {
            const count = value[2];
            return Math.min(Math.max(Math.sqrt(count) * 12, 8), 48);
          },
        },
      ],
    };
  }, [bubbleTimelineData, hasData]);
  return (
    <DashboardSection
      title='Global Entity Risk & Sentiment Trends'
      description='Tracks top mentioned entities across time buckets. Bubble size indicates total news volume; color maps to average sentiment and risk intensity.'
      children={
        hasData && chartOption ? (
          <EChartContainer option={chartOption} height={height} />
        ) : (
          <EmptyDataCard
            title='No data available'
            description='No entity trends were found for this selection.'
            height={height}
          />
        )
      }
    />
  );
};

export default BubbleTimelineChart;
