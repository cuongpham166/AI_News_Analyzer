import { Flex, Box } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { createDataZoom } from '@/shared/utils/chartConfig.ts';
import type { GlobalEntitiesTrends } from '@/shared/types/analysis';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import {NEWS_ENTITY_COLORS} from "@/shared/constants/NewsEntities.ts";
import {getEntitiesHeatmapData} from "@/components/Overview/EntityTrends/components/EntitiesHeatmap/entitiesHeatmap.utils.ts";

interface EntitiesHeatmapProps {
  data?: GlobalEntitiesTrends;
  height?: number | string;
  topLimit?: number;
}


export const EntitiesHeatmap: React.FC<EntitiesHeatmapProps> = ({
  data,
  height = 450,
  topLimit = 20,
}) => {
  const { dates, entities, chartData } = useMemo(
    () => getEntitiesHeatmapData(data, topLimit),
    [data, topLimit],
  );

  const maxMentions = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map((item) => item[2]), 1);
  }, [chartData]);

  const hasData = chartData.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) return undefined;

    return {
      title: {
        left: 'left',
        textStyle: { fontSize: 16, fontWeight: 'bold' },
        subtextStyle: { fontSize: 12, color: '#6B7280' },
      },
      dataZoom: createDataZoom('both'),
      grid: {
        top: 10,
        bottom: 50,
        left: 10,
        right: 120,
        containLabel: true,
      },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        padding: [10, 14],
        borderColor: '#374151',
        textStyle: { color: '#F9FAFB', fontSize: 12 },
        formatter: (params: any) => {
          const [
            xIdx,
            yIdx,
            count,
            sentiment,
            riskScore,
            posVol,
            negVol,
            type,
          ] = params.data;
          const entityName = entities[yIdx];
          const dateStr = dates[xIdx];
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

          const total = Number(count) || 0;
          const positive = Number(posVol) || 0;
          const negative = Number(negVol) || 0;

          return createCustomChartTooltip({
            title: entityName,
            subtitle: `Date: ${dateStr}`,
            badge: String(type).toUpperCase(),
            badgeBgColor: NEWS_ENTITY_COLORS[type],
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
        type: 'category',
        data: dates,
        axisLabel: { rotate: 30 },
        splitArea: { show: true },
        axisLine: { lineStyle: { color: '#9CA3AF' } },
      },
      yAxis: {
        type: 'category',
        data: entities,
        inverse: true, // Displays top-ranked entities starting from the top row
        splitArea: { show: true },
        axisLine: { lineStyle: { color: '#9CA3AF' } },
      },
      visualMap: {
        min: 0,
        dimension: 2,
        max: maxMentions,
        calculable: true,
        orient: 'vertical',
        right: 17,
        top: 'center',
        text: ['High Activity', 'Low Activity'],
        inRange: {
          color: ['#EFF6FF', '#93C5FD', '#3B82F6', '#1E40AF', '#1E1B4B'],
        },
        textStyle: { color: '#4B5563', fontSize: 11 },
      },
      series: [
        {
          name: 'Entity Mentions',
          type: 'heatmap',
          data: chartData,
          label: {
            show: true,
            fontSize: 10,
            formatter: (params: any) => params.data[2] || '',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.5)',
              borderColor: '#111827',
              borderWidth: 1,
            },
          },
        },
      ],
    };
  }, [chartData, dates, entities, maxMentions, hasData]);

  return (
    <DashboardSection
      title='Entity Activity Heatmap'
      description='Color intensity indicates the number of news articles mentioning each entity in each time period.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default EntitiesHeatmap;
