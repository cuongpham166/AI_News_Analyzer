import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Flex, Box } from '@mantine/core';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import DashboardSection from '@/components/generic/DashboardSection';
import type { GlobalEntitiesTrends } from '@/shared/types/analysis';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {getRankingChartData} from '@/components/Overview/EntityTrends/components/RankingChart/rankingChart.utils.ts';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';

interface RankingChartProps {
  data?: GlobalEntitiesTrends;
  height?: number | string;
  topLimit?: number;
}

export const RankingChart: React.FC<RankingChartProps> = ({
  data,
  height = 500,
  topLimit = 20,
}) => {
  const { chartData } = useMemo(
    () => getRankingChartData(data, topLimit),
    [data, topLimit],
  );

  const hasData = chartData.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) return undefined;

    return {
      title: {
        left: 'left',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
        subtextStyle: { fontSize: 12, color: '#6B7280' },
      },
      grid: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 80,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        padding: [10, 14],
        textStyle: { color: '#F9FAFB', fontSize: 12 },
        formatter: (params: any) => {
          if (!params || !params.length) return '';
          const [entity, mentions, sentiment, riskScore, posVol, negVol, type] = params[0].value;
          const riskPercentage = (riskScore * 100).toFixed(1);


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

          const total = Number(posVol+negVol) || 0;
          const positive = Number(posVol) || 0;
          const negative = Number(negVol) || 0;

          return createCustomChartTooltip({
            title: entity,
            badge: String(type).toUpperCase(),
            badgeBgColor: NEWS_ENTITY_COLORS[type],
            colors: {
              ...sentimentColors,
              neutral: '#64748B',
            },

            metrics: [
              {
                label: 'Mentions',
                value: mentions,
              },
              {
                label: 'Risk Score',
                value: `${riskPercentage}%`,
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
      dataset: [
        {
          dimensions: [
            'entity',
            'mentions',
            'sentiment',
            'riskScore',
            'posVol',
            'negVol',
            'type',
          ],
          source: chartData,
        },
      ],
      xAxis: {
        type: 'value',
        name: 'Mentions',
        nameLocation: 'end',
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        splitLine: { lineStyle: { color: '#F3F4F6' } },
      },
      yAxis: {
        type: 'category',
        inverse: true, // Rank #1 appears at the top
        axisLabel: {
          interval: 0,
          color: '#374151',
          fontWeight: 500,
        },
        axisLine: { lineStyle: { color: '#9CA3AF' } },
      },
      series: [
        {
          name: 'Mentions',
          type: 'bar',
          encode: { x: 'mentions', y: 'entity' },
          barMaxWidth: 22,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: (params: any) => {
              const sentiment = params.value[2];
              const riskScore = params.value[3];

              if (riskScore > 0.5 || sentiment < -0.2) {
                return NEWS_SENTIMENT_COLORS['negative'];
              }
              if (sentiment > 0.2) {
                return NEWS_SENTIMENT_COLORS['positive'];
              }
              return NEWS_SENTIMENT_COLORS["default"];
            },
          },
          label: {
            show: true,
            position: 'right',
            color: '#4B5563',
            fontWeight: 600,
            fontSize: 11,
            formatter: (params: any) => params.value[1],
          },
        },
      ],
    };
  }, [chartData, hasData]);
  return (
    <DashboardSection
      title='Top Entity Mentions Ranking'
      description='Entities ranked by total news volume. Bar colors reflect sentiment direction and risk levels.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default RankingChart;
