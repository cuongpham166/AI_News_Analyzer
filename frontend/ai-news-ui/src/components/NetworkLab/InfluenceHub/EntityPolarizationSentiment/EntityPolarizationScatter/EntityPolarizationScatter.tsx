import { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import EntityPolarizationLegend
  from '@/components/NetworkLab/InfluenceHub/EntityPolarizationSentiment/EntityPolarizationScatter/components/EntityPolarizationLegend.tsx';
import type { EntityPolarizationType } from '@/shared/interfaces/analysis/EntityNetworkLab/EntityPolarizationType.ts';
import {  Stack } from '@mantine/core';
interface EntityPolarizationScatterProps {
  data: EntityPolarizationType[];
  height?: number | string;
}

const ENTITY_GROUP_COLORS: Record<string, string> = {
  Location: '#EE6666',
  Person: '#5470C6',
  Organization: '#3BA272',
};

const DEFAULT_COLOR = '#868e96';

export function EntityPolarizationScatter({
  data,
  height = 420,
}: EntityPolarizationScatterProps) {
  const chartOption = useMemo<EChartsOption>(() => {
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
          return `
            <div style="font-weight: 600; margin-bottom: 4px;">${item.entity}</div>
            <div style="font-size: 12px; color: #868e96; margin-bottom: 6px;">
              Group: ${item.entityGroup}
            </div>
            <div style="font-size: 12px;">
              • <strong>Articles:</strong> ${item.totalArticles}<br/>
              • <strong>Avg Sentiment:</strong> ${item.avgSentiment}<br/>
              • <strong>Polarization:</strong> ${item.polarizationScore}
            </div>
          `;
        },
      },
      grid: {
        top: 30,
        right: 40,
        bottom: 50,
        left: 50,
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
        name: 'Sentiment Variation',
        nameLocation: 'middle',
        nameGap: 35,
        min: 0,
        max: 1,
        splitLine: { show: true },
      },
      series: [
        {
          type: 'scatter',
          data: data.map((item) => {
            const pointColor =
              ENTITY_GROUP_COLORS[item.entityGroup] || DEFAULT_COLOR;

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
            return Math.min(Math.max(count * 3, 12), 40);
          },
          markArea: {
            silent: true,
            data: [
              // Top Right (Positive sentiment, High polarization)
              [
                {
                  xAxis: 0,
                  yAxis: 0.5,
                  itemStyle: {
                    color: 'rgba(255, 192, 203, 0.25)',
                  },
                },
                {
                  xAxis: 1,
                  yAxis: 1,
                },
              ],

              // Top Left (Negative sentiment, High polarization)
              [
                {
                  xAxis: -1,
                  yAxis: 0.5,
                  itemStyle: {
                    color: 'rgba(173, 216, 230, 0.25)',
                  },
                },
                {
                  xAxis: 0,
                  yAxis: 1,
                },
              ],

              // Bottom Left (Negative sentiment, Low polarization)
              [
                {
                  xAxis: -1,
                  yAxis: 0,
                  itemStyle: {
                    color: 'rgba(144, 238, 144, 0.25)',
                  },
                },
                {
                  xAxis: 0,
                  yAxis: 0.5,
                },
              ],

              // Bottom Right (Positive sentiment, Low polarization)
              [
                {
                  xAxis: 0,
                  yAxis: 0,
                  itemStyle: {
                    color: 'rgba(255, 255, 224, 0.25)',
                  },
                },
                {
                  xAxis: 1,
                  yAxis: 0.5,
                },
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
            data: [{ xAxis: 0 }, { yAxis: 0.5 }],
          },
        },
      ],
    };
  }, [data]);

  return (
    <Stack>
      <EChartContainer option={chartOption} height={height} />
      <EntityPolarizationLegend />
    </Stack>
  );
}

export default EntityPolarizationScatter;