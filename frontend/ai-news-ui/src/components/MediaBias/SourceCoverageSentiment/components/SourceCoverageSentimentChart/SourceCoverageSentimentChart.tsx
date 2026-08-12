import type { MediaBias } from '@/shared/types/analysis/MediaBias.ts';
import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import {NEWS_SOURCES_COLORS} from '@/shared/constants/NewsSources.ts';
import SourceCoverageSentimentLegend from './components/SourceCoverageSentimentLegend.tsx';

interface SourceCoverageSentimentChartProps {
  data:MediaBias[]
  height?: number;
}
const SourceCoverageSentimentChart = ({ data, height = 450 }:SourceCoverageSentimentChartProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const sources = [...new Set(data.map((item) => item.source))];
    const topics = [...new Set(data.map((item) => item.topic))];
    const sortedTopics = topics.sort((a, b) => {
      const totalA = data
        .filter((item) => item.topic === a)
        .reduce((sum, item) => sum + item.volume, 0);

      const totalB = data
        .filter((item) => item.topic === b)
        .reduce((sum, item) => sum + item.volume, 0);

      return totalB - totalA;
    });
    const getVolume = (source: string, topic: string) => {
      return (
        data.find((item) => item.source === source && item.topic === topic)
          ?.volume ?? 0
      );
    };

    const getSentiment = (source: string, topic: string) => {
      return (
        data.find((item) => item.source === source && item.topic === topic)
          ?.avgSentiment ?? null
      );
    };
    return {
      animationDuration: 500,

      grid: {
        left: 100,
        right: 40,
        top: 40,
        bottom: 40,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },

        formatter: (params: any[]) => {
          const topic = params[0].axisValue;

          const rows = params
            .map((param) => {
              const sentiment = getSentiment(param.seriesName, topic);

              return `
              <div>
                ${param.marker}
                ${param.seriesName}:
                <strong>${param.value}</strong> articles
                ${
                  sentiment !== null
                    ? `<span style="color:#868e96">
                        · ${sentiment.toFixed(2)} sentiment
                      </span>`
                    : ''
                }
              </div>
            `;
            })
            .join('');

          return `
          <strong>${topic}</strong>
          <div style="margin-top:8px">
            ${rows}
          </div>
        `;
        },
      },

      xAxis: {
        type: 'value',
        name: 'Articles',
        nameLocation: 'middle',
        nameGap: 30,
        minInterval: 1,
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: sortedTopics,
        axisLabel: {
          interval: 0,
          formatter: (value: string) =>
            value.charAt(0).toUpperCase() + value.slice(1),
        },
      },

      series: sources.map((source) => ({
        name: source,
        type: 'bar',

        data: sortedTopics.map((topic) => ({
          value: getVolume(source, topic),
          itemStyle: {
            color: NEWS_SOURCES_COLORS[source],
          },
        })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c}',
          color: '#495057',
          fontWeight: 600,
        },
      })),
    };
  }, [data]);

  return (
    <DashboardSection
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'><SourceCoverageSentimentLegend/></Box>
        </Flex>
      }
    />
  );
};

export default SourceCoverageSentimentChart