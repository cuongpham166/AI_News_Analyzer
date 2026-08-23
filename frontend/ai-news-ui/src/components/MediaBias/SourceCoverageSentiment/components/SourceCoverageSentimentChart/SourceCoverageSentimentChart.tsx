import type { SourceCoverage } from '@/shared/types/analysis/media_bias/SourceCoverage.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import {NEWS_SOURCES_COLORS} from '@/shared/constants/NewsSources.ts';
import SourceCoverageSentimentLegend from './components/SourceCoverageSentimentLegend.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

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

    // Sort topics by total article volume
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

    const heatmapData = sources.flatMap((source, sourceIndex) =>
      sortedTopics.map((topic, topicIndex) => {
        const item = getCoverage(source, topic);

        return [sourceIndex, topicIndex, item?.volume ?? 0];
      }),
    );

    const maxVolume = Math.max(...heatmapData.map((item) => item[2]));

    return {
      animationDuration: 500,

      grid: {
        left: 100,
        right: 40,
        top: 10,
        bottom: 80,
      },

      tooltip: {
        position: 'top',

        formatter: (params: any) => {
          const [sourceIndex, topicIndex, volume] = params.value;

          const source = sources[sourceIndex];
          const topic = sortedTopics[topicIndex];

          const item = getCoverage(source, topic);
          const sentiment = item?.avgSentiment ?? null;

          return `
            <div style="min-width: 180px">
              <strong>
                ${topic.charAt(0).toUpperCase() + topic.slice(1)}
              </strong>

              <div style="margin-top: 8px">
                ${params.marker}
                ${source}:
                <strong>${volume}</strong> articles
              </div>

              ${
                sentiment !== null
                  ? `
                    <div style="margin-top: 4px; color: #868e96">
                      Average sentiment:
                      <strong>${sentiment.toFixed(2)}</strong>
                    </div>
                  `
                  : ''
              }
            </div>
          `;
        },
      },

      xAxis: {
        type: 'category',
        data: sources,
        position: 'top',
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          color: '#475569',
          fontSize: 11,
          fontWeight: 500,
        },
      },

      yAxis: {
        type: 'category',
        data: sortedTopics.map(
          (topic) => topic.charAt(0).toUpperCase() + topic.slice(1),
        ),
        inverse: true,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: '#475569',
          fontSize: 12,
        },
      },

      visualMap: {
        min: 0,
        max: maxVolume || 1,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,

        itemWidth: 14,
        itemHeight: 120,

        inRange: {
          color: [
            '#EFF6FF',
            '#DBEAFE',
            '#BFDBFE',
            '#93C5FD',
            '#60A5FA',
            '#3B82F6',
            '#1D4ED8',
          ],
        },

        text: ['High', 'Low'],
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
            color: '#334155',
            fontSize: 11,
            fontWeight: 600,
            formatter: (params: any) => {
              const value = params.value[2];

              return value > 0 ? String(value) : '';
            },
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 8,
              shadowColor: 'rgba(15, 23, 42, 0.15)',
              borderColor: '#334155',
              borderWidth: 1,
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