import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import EntityPolarizationLegend
  from './components/EntityPolarizationLegend.tsx';
import type { EntityPolarizationType } from '@/shared/interfaces/analysis/EntityNetworkLab/EntityPolarizationType.ts';
import { Box, Flex, Stack } from '@mantine/core';
import DashboardSection from '@/components/generic/DashboardSection';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import {
  createCustomChartTooltip,
  escapeHtml,
} from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';


interface EntityPolarizationScatterProps {
  data?: EntityPolarizationType[];
  height?: number | string;
}

const DEFAULT_COLOR = '#868e96';

export function EntityPolarizationScatter({
  data,
  height = 500,
}: EntityPolarizationScatterProps) {
  const hasData = Boolean(data && data.length > 0);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !data) {
      return undefined;
    }

    const POLARIZATION_THRESHOLD = 0.35;

    return {
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty',
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          filterMode: 'empty',
        },
      ],
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const item = params.data as EntityPolarizationType;
          const sentiment = item.avgSentiment;
          const pos = item.positiveCount ?? 0;
          const neg = item.negativeCount ?? 0;
          const total = item.totalArticles;
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

          return createCustomChartTooltip({
            title: item.entity,
            badge: String(item.entityGroup).toUpperCase(),
            badgeBgColor: NEWS_ENTITY_COLORS[item.entityGroup.toLowerCase()],
            colors: {
              ...sentimentColors,
              neutral: '#64748B',
            },
            metrics: [
              {
                label: 'Positive Articles',
                value: pos,
                color: sentimentColors.positive,
              },
              {
                label: 'Conflict Articles',
                value: neg,
                color: sentimentColors.negative,
              },
              {
                label: 'Mentions',
                value: item.totalArticles,
              },
              {
                label: 'Avg. Sentiment',
                color: sentimentColor,
                value: item.avgSentiment.toFixed(2),
              },
              {
                label: 'Polarization Score',
                value: item.polarizationScore.toFixed(2),
              },
            ],
            distribution: {
              segments: [
                {
                  label: 'Pos',
                  percentage: total > 0 ? (pos / total) * 100 : 0,
                  color: sentimentColors.positive,
                },
                {
                  label: 'Conflict',
                  percentage: total > 0 ? (neg / total) * 100 : 0,
                  color: sentimentColors.negative,
                },
              ],
            },
          });
        },
      },
      grid: {
        top: 30,
        right: 40,
        bottom: 50,
        left: 55,
      },
      xAxis: {
        type: 'value',
        name: 'Avg Sentiment',
        nameLocation: 'middle',
        nameGap: 30,
        min: -1,
        max: 1,
        splitLine: { show: true },
      },
      yAxis: {
        type: 'value',
        name: 'Polarization Score',
        nameLocation: 'middle',
        nameGap: 38,
        min: 0,
        max: 1,
        splitLine: { show: true },
      },
      series: [
        {
          type: 'scatter',
          data: data.map((item) => {
            const groupKey = item.entityGroup
              ? item.entityGroup.toLowerCase()
              : '';
            const pointColor = NEWS_ENTITY_COLORS[groupKey] || DEFAULT_COLOR;

            return {
              name: item.entity,
              value: [
                item.avgSentiment,
                item.polarizationScore,
                item.totalArticles,
              ],
              itemStyle: {
                color: pointColor,
                opacity: 0.85,
              },
              ...item,
            };
          }),
          symbolSize: (val: any) => {
            const count = val[2] as number;
            return Math.min(Math.max(Math.sqrt(count) * 4 + 8, 12), 42);
          },
          markArea: {
            silent: true,
            data: [
              [
                {
                  xAxis: 0,
                  yAxis: POLARIZATION_THRESHOLD,
                  itemStyle: { color: 'rgba(255, 192, 203, 0.15)' },
                },
                { xAxis: 1, yAxis: 1 },
              ],
              [
                {
                  xAxis: -1,
                  yAxis: POLARIZATION_THRESHOLD,
                  itemStyle: { color: 'rgba(173, 216, 230, 0.15)' },
                },
                { xAxis: 0, yAxis: 1 },
              ],
              [
                {
                  xAxis: -1,
                  yAxis: 0,
                  itemStyle: { color: 'rgba(255, 235, 204, 0.15)' },
                },
                { xAxis: 0, yAxis: POLARIZATION_THRESHOLD },
              ],
              [
                {
                  xAxis: 0,
                  yAxis: 0,
                  itemStyle: { color: 'rgba(144, 238, 144, 0.15)' },
                },
                { xAxis: 1, yAxis: POLARIZATION_THRESHOLD },
              ],
            ],
          },
          markLine: {
            silent: true,
            symbol: ['none', 'none'],
            lineStyle: {
              type: 'dashed',
              color: '#adb5bd',
              width: 1.5,
            },
            data: [
              { xAxis: 0 },
              { yAxis: POLARIZATION_THRESHOLD },
            ],
          },
        },
      ],
    };
  }, [data, hasData]);

  return (
    <DashboardSection
      title='Sentiment vs. Polarization'
      description='Visualize entities by average sentiment and polarization score to identify patterns, clusters, and highly polarized entities.'
    >
      <Flex direction='column' h='100%'>
        <Box style={{ flex: 1, minHeight: 0 }}>
          {hasData && chartOption ? (
            <EChartContainer option={chartOption} height={height} />
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No entity polarization data were found.'
            />
          )}
        </Box>
        <EntityPolarizationLegend />
      </Flex>
    </DashboardSection>
  );
}

export default EntityPolarizationScatter;