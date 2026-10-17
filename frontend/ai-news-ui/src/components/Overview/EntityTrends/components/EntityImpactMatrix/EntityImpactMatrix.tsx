import { Flex, Box } from '@mantine/core';
import EntityImpactMatrixLegend
  from '@/components/Overview/EntityTrends/components/EntityImpactMatrix/components/EntityImpactMatrixLegend.tsx';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';
import {
  getEntityImpactData,
  getMedian,
} from '@/components/Overview/EntityTrends/components/EntityImpactMatrix/entityImpactMatrix.utils.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import DashboardSection from '@/components/generic/DashboardSection';
import type { GlobalEntitiesTrends } from '@/shared/types/analysis';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';

interface EntityImpactMatrixProps {
  data?: GlobalEntitiesTrends;
  height?: number | string;
  topLimit?: number;
}

const EntitiesImpactMatrix: React.FC<EntityImpactMatrixProps> = ({
  data,
  height = 500,
  topLimit = 30,
}) => {
  const { chartData, impactItems } = useMemo(
    () => getEntityImpactData(data, topLimit),
    [data, topLimit],
  );

  const hasData = chartData.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) return undefined;

    const sentiments = impactItems.map((d) => d.sentiment);
    const mentions = impactItems.map((d) => d.mentions);

    const sentimentMedian = getMedian(sentiments);
    const mentionsMedian = getMedian(mentions);
    const maxMentions = Math.max(...mentions, 1);

    return {
      title: {
        left: 'left',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
        subtextStyle: { fontSize: 12, color: '#6B7280' },
      },
      grid: {
        left: 40,
        right: 40,
        top: 40,
        bottom: 40,
        containLabel: true,
      },
      tooltip: {
        trigger: 'item',
        borderColor: '#374151',
        padding: [10, 14],
        formatter: ({ data }: any) => {
          const [
            sentiment,
            mentionsCount,
            entity,
            riskScore,
            posVol,
            negVol,
            type,
          ] = data;
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

          const total = Number(mentionsCount) || 0;
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
                value: mentionsCount,
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
      xAxis: {
        type: 'value',
        name: 'Average Article Sentiment',
        nameLocation: 'middle',
        nameGap: 30,
        min: -1.0, // Signed sentiment scale
        max: 1.0,
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        splitLine: { lineStyle: { color: '#F3F4F6' } },
      },
      yAxis: {
        type: 'value',
        name: 'Total Mentions',
        min: 0,
        max: Math.ceil(maxMentions * 1.1),
        axisLine: { lineStyle: { color: '#9CA3AF' } },
        splitLine: { lineStyle: { color: '#F3F4F6' } },
      },
      dataZoom: [
        { type: 'inside', xAxisIndex: 0, filterMode: 'empty' },
        { type: 'inside', yAxisIndex: 0, filterMode: 'empty' },
      ],
      series: [
        {
          type: 'scatter',
          data: chartData,
          symbolSize: (value: any[]) => Math.max(14, Math.sqrt(value[1]) * 8),
          itemStyle: {
            color: (params: any) => {
              const sentiment = params.value[0];
              const riskScore = params.value[3];
              if (riskScore > 0.5 || sentiment < -0.2) return NEWS_SENTIMENT_COLORS["negative"];
              if (sentiment > 0.2) return NEWS_SENTIMENT_COLORS['positive'];
              return NEWS_SENTIMENT_COLORS['default'];
            },
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.15)',
          },
          label: {
            show: true,
            formatter: (params: any) => params.data[2],
            position: 'top',
            fontSize: 11,
            color: '#374151',
            fontWeight: 500,
          },
          emphasis: {
            scale: 1.2,
            itemStyle: {
              shadowBlur: 12,
              shadowColor: 'rgba(0,0,0,0.3)',
            },
          },
          // Quadrant background shading
          markArea: {
            silent: true,
            data: [
              // Top-Left: High Volume / Negative (High Risk Spotlight)
              [
                {
                  xAxis: -1.0,
                  yAxis: mentionsMedian,
                  itemStyle: { color: '#FEE2E2', opacity: 0.35 },
                },
                {
                  xAxis: sentimentMedian,
                  yAxis: maxMentions * 1.1,
                },
              ],
              // Top-Right: High Volume / Positive (Positive Champions)
              [
                {
                  xAxis: sentimentMedian,
                  yAxis: mentionsMedian,
                  itemStyle: { color: '#D1FAE5', opacity: 0.35 },
                },
                {
                  xAxis: 1.0,
                  yAxis: maxMentions * 1.1,
                },
              ],
              // Bottom-Left: Low Volume / Negative (Watch List)
              [
                {
                  xAxis: -1.0,
                  yAxis: 0,
                  itemStyle: { color: '#F3F4F6', opacity: 0.35 },
                },
                {
                  xAxis: sentimentMedian,
                  yAxis: mentionsMedian,
                },
              ],
              // Bottom-Right: Low Volume / Positive (Emerging Signals)
              [
                {
                  xAxis: sentimentMedian,
                  yAxis: 0,
                  itemStyle: { color: '#E0F2FE', opacity: 0.35 },
                },
                {
                  xAxis: 1.0,
                  yAxis: mentionsMedian,
                },
              ],
            ],
          },
          // Median dividing lines
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: {
              type: 'dashed',
              color: '#6B7280',
              width: 1.5,
            },
            data: [{ xAxis: sentimentMedian }, { yAxis: mentionsMedian }],
          },
        },
      ],
    };
  }, [chartData, impactItems, hasData]);
  return (
    <DashboardSection
      title='Entity Impact Matrix'
      description='Entities positioned by news coverage volume (Y-axis) and signed sentiment (X-axis). Quadrants highlight risk vs opportunity.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'>
            <EntityImpactMatrixLegend />
          </Box>
        </Flex>
      }
    />
  );
};

export default EntitiesImpactMatrix;
