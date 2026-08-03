import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Text, Stack, Title } from '@mantine/core';
import EntityImpactMatrixLegend
  from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/EntityImpactMatrix/components/EntityImpactMatrixLegend.tsx';
import type {
  GlobalEntitiesTrendsType
} from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';
import {
  getEntityImpactData,
  getMedian,
} from '@/components/Overview/EntityTopicIntelligenceBreakdown/EntityTrends/components/EntityImpactMatrix/entityImpactMatrix.utils.ts';
import EChartContainer from '@/components/generic/EChartContainer';

interface EntityImpactMatrixProps {
  data: GlobalEntitiesTrendsType;
  height?: number | string;
}

const EntitiesImpactMatrix = ({data,height}:EntityImpactMatrixProps) => {
  const impactData = getEntityImpactData(data);
  const chartOption = useMemo<EChartsOption>(() => {
    const sentimentMedian = getMedian(impactData.map((d) => d.sentiment));
    const mentionsMedian = getMedian(impactData.map((d) => d.mentions));
    const maxMentions = Math.max(...impactData.map((d) => d.mentions), 1);

    return {
      grid: {
        left: 80,
        right: 30,
        top: 40,
        bottom: 70,
      },

      tooltip: {
        trigger: 'item',
        formatter: ({ data }: any) => `
      <strong>${data[2]}</strong><br/>
      Mentions: ${data[1]}<br/>
      Average sentiment: ${data[0].toFixed(3)}
    `,
      },

      xAxis: {
        type: 'value',
        name: 'Average Article Sentiment',
        min: 0,
        max: 1,
      },

      yAxis: {
        type: 'value',
        name: 'Mentions',
        min: 0,
        max: maxMentions + 1,
      },
      dataZoom:[
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
      series: [
        {
          type: 'scatter',

          data: impactData.map((item) => [
            item.sentiment,
            item.mentions,
            item.entity,
          ]),

          symbolSize: (value: number[]) =>
            Math.max(12, Math.sqrt(value[1]) * 10),

          itemStyle: {
            color: '#228be6',
          },

          label: {
            show: true,
            formatter: (params: any) => params.data[2],
            position: 'top',
            fontSize: 11,
          },

          emphasis: {
            scale: true,
          },

          // Quadrant background
          markArea: {
            silent: true,

            data: [
              // Top-left (Negative Spotlight)
              [
                {
                  xAxis: 0,
                  yAxis: mentionsMedian,
                  itemStyle: {
                    color: '#ffe3e3',
                    opacity: 0.25,
                  },
                },
                {
                  xAxis: sentimentMedian,
                  yAxis: maxMentions + 1,
                },
              ],

              // Top-right (Positive Spotlight)
              [
                {
                  xAxis: sentimentMedian,
                  yAxis: mentionsMedian,
                  itemStyle: {
                    color: '#d3f9d8',
                    opacity: 0.25,
                  },
                },
                {
                  xAxis: 1,
                  yAxis: maxMentions + 1,
                },
              ],

              // Bottom-left (Watch List)
              [
                {
                  xAxis: 0,
                  yAxis: 0,
                  itemStyle: {
                    color: '#f1f3f5',
                    opacity: 0.25,
                  },
                },
                {
                  xAxis: sentimentMedian,
                  yAxis: mentionsMedian,
                },
              ],

              // Bottom-right (Positive Signals)
              [
                {
                  xAxis: sentimentMedian,
                  yAxis: 0,
                  itemStyle: {
                    color: '#d0ebff',
                    opacity: 0.25,
                  },
                },
                {
                  xAxis: 1,
                  yAxis: mentionsMedian,
                },
              ],
            ],
          },

          // Median divider lines
          markLine: {
            silent: true,

            symbol: 'none',

            lineStyle: {
              type: 'dashed',
              color: '#868e96',
              width: 1,
            },

            data: [
              {
                xAxis: sentimentMedian,
              },
              {
                yAxis: mentionsMedian,
              },
            ],
          },
        },
      ],
    };
  }, [impactData]);
  return (
    <Stack gap='lg'>
      <Stack gap={2}>
        <Title order={6} c={ThemeColors.primary}>
          Entity Impact Matrix
        </Title>
        <Text size='sm' c='dimmed' lh={1.2}>
          Entities positioned by news coverage volume and average article
          sentiment.
        </Text>
      </Stack>
      <EChartContainer option={chartOption} height={height} />
      <EntityImpactMatrixLegend />
    </Stack>
  );
};

export default EntitiesImpactMatrix;
