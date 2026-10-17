import type { SourceCoverage } from '@/shared/types/analysis/media_bias/SourceCoverage.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import {
  NEWS_SOURCES_COLORS,
  NEWS_SOURCES_FULL_NAMES,
} from '@/shared/constants/NewsSources.ts';
import SourceCoverageSentimentLegend from './components/SourceCoverageSentimentLegend.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';

interface SourceCoverageSentimentChartProps {
  sourceCoverage?: SourceCoverage[];
  height?: number;
}
const SourceCoverageSentimentChart = ({
  height = 410,
  sourceCoverage,
}: SourceCoverageSentimentChartProps) => {
  const hasData = sourceCoverage && sourceCoverage.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    const sources = [...new Set(sourceCoverage.map((item) => item.source))];
    const topics = [...new Set(sourceCoverage.map((item) => item.topic))];

    // Sort topics by total article volume across all sources
    const sortedTopics = topics.sort((a, b) => {
      const totalA = sourceCoverage
        .filter((item) => item.topic === a)
        .reduce((sum, item) => sum + item.volume, 0);

      const totalB = sourceCoverage
        .filter((item) => item.topic === b)
        .reduce((sum, item) => sum + item.volume, 0);

      return totalB - totalA;
    });

    const coverageMap = new Map(
      sourceCoverage.map((item) => [`${item.source}__${item.topic}`, item]),
    );

    const getCoverage = (source: string, topic: string) =>
      coverageMap.get(`${source}__${topic}`);

    // Map heatmap data: [sourceIndex, topicIndex, avgSentiment, volume, positiveVolume, negativeVolume]
    const heatmapData = sources.flatMap((source, sourceIndex) =>
      sortedTopics.map((topic, topicIndex) => {
        const item = getCoverage(source, topic);
        if (!item || item.volume === 0) {
          return [sourceIndex, topicIndex, null, 0, 0, 0];
        }
        return [
          sourceIndex,
          topicIndex,
          item.avgSentiment,
          item.volume,
          item.positiveVolume,
          item.negativeVolume,
        ];
      }),
    );

    return {
      animationDuration: 500,

      grid: {
        left: 110,
        right: 40,
        top: 30,
        bottom: 85,
      },

      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',
        formatter: (params: any) => {
          const [sourceIndex, topicIndex, sentiment, volume, posVol, negVol] =
            params.value;

          if (volume === 0 || sentiment === null) {
            return `<div style="font-size: 12px; color: #64748B;">No coverage</div>`;
          }

          const source = sources[sourceIndex];
          const topic = sortedTopics[topicIndex];
          const formattedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

          const posPct = Math.round((posVol / volume) * 100);
          const negPct = Math.round((negVol / volume) * 100);

          const sentimentLabel =
            sentiment > 0.15
              ? 'Positive Lean'
              : sentiment < -0.15
                ? 'Negative Lean'
                : 'Balanced / Split';

          const badgeColor =
            sentiment > 0
              ? NEWS_SENTIMENT_COLORS['positive']
              :  NEWS_SENTIMENT_COLORS['negative'];

          return createCustomChartTooltip({
            title: formattedTopic,
            subtitle: NEWS_SOURCES_FULL_NAMES[source],
            badge: String(source).toUpperCase(),
            badgeBgColor: NEWS_SOURCES_COLORS[source],
            metrics: [
              {
                label: 'Positive Articles',
                value: `${posVol}`,
                color: NEWS_SENTIMENT_COLORS['positive'],
              },
              {
                label: 'Negative Articles',
                value: `${negVol}`,
                color: NEWS_SENTIMENT_COLORS['negative'],
              },
              {
                label: 'Total Volume',
                value: `${volume}`,
              },
              {
                label: 'Avg. Sentiment',
                color: badgeColor,
                value: `${sentiment.toFixed(2)} (${sentimentLabel})`,
              },
            ],
            distribution: {
              segments: [
                {
                  label: 'Pos',
                  percentage: posPct,
                  color: NEWS_SENTIMENT_COLORS['positive'],
                },
                {
                  label: 'Conflict',
                  percentage: negPct,
                  color: NEWS_SENTIMENT_COLORS['negative'],
                },
              ],
            },
          });
        },
      },

      xAxis: {
        type: 'category',
        data: sources,
        position: 'top',
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          interval: 0,
          rotate: -45,
          color: '#475569',
          fontSize: 11,
          fontWeight: 600,
          hideOverlap: true,
        },
      },

      yAxis: {
        type: 'category',
        data: sortedTopics.map(
          (topic) => topic.charAt(0).toUpperCase() + topic.slice(1),
        ),
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: '#475569',
          fontSize: 12,
        },
      },

      visualMap: {
        type: 'continuous',
        dimension: 2,
        min: -1.0,
        max: 1.0,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        itemWidth: 16,
        itemHeight: 180,
        precision: 2,

        inRange: {
          color: [
            '#DC2626',
            '#FCA5A5',
            '#F8FAFC',
            '#86EFAC',
            '#16A34A',
          ],
        },

        text: ['+1.0 Positive', '-1.0 Negative'],
        textStyle: {
          color: '#64748B',
          fontSize: 11,
        },
      },

      series: [
        {
          type: 'heatmap',
          data: heatmapData,

          label: {
            show: true,
            fontSize: 11,
            fontWeight: 600,
            formatter: (params: any) => {
              const volume = params.value[3];
              return volume > 0 ? String(volume) : '';
            },
            color: (params: any) => {
              const sentiment = params.value[2];
              if (sentiment !== null && (sentiment > 0.5 || sentiment < -0.5)) {
                return '#FFFFFF';
              }
              return '#1E293B';
            },
          },

          itemStyle: {
            borderColor: '#FFFFFF',
            borderWidth: 1.5,
            borderRadius: 3,
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 6,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              borderColor: '#0F172A',
              borderWidth: 1.5,
            },
          },
        },
      ],
    };
  }, [hasData, sourceCoverage]);

  return (
    <DashboardSection
      children={
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No source coverage data were found for this selection.'
              />
            )}
          </Box>
      }
    />
  );
};

export default SourceCoverageSentimentChart