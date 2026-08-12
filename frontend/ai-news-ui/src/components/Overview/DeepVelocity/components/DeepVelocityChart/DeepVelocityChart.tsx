import React, { useMemo } from 'react';
import type { DeepVelocityType } from '@/shared/interfaces/analysis/ExecutiveOverview/DeepVelocityType.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import DeepVelocityLegend from '@/components/Overview/DeepVelocity/components/DeepVelocityChart/components/DeepVelocityLegend.tsx';
import { Stack } from '@mantine/core';
import {
  buildScatterData,
  buildTooltip,
  calculateChartMetrics,
  createMarkArea,
  createMarkLine,
} from '@/components/Overview/DeepVelocity/components/DeepVelocityChart/deepVelocity.utils.ts';
import {
  DATA_ZOOM,
  GRID,
} from '@/components/Overview/DeepVelocity/components/DeepVelocityChart/deepVelocity.config.ts';

interface DeepVelocityChartProps {
  data: DeepVelocityType[];
  height?: number | string;
}

const DeepVelocityChart = ({ data,height=420 }:DeepVelocityChartProps) => {
  const metrics = calculateChartMetrics(data);

  const chartOption = useMemo<EChartsOption>(() => {
    return {
      dataZoom: DATA_ZOOM,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const item = params.data as DeepVelocityType;
          return buildTooltip(item);
        },
      },
      grid: GRID,
      xAxis: {
        type: 'value',
        name: 'Current Mentions',
        min: 0,
        max: metrics.maxMentions * 1.2,
      },
      yAxis: {
        type: 'value',
        name: 'Velocity %',
        min: 0,
        max: metrics.maxVelocity * 1.2,
      },
      series: [
        {
          type: 'scatter',
          data: buildScatterData(data),
          symbolSize: (val: number[]) => {
            const score = val[2] || 1;
            return Math.min(Math.max(score / 2, 12), 40);
          },

          markArea: createMarkArea(
            metrics.mentionThreshold,
            metrics.velocityThreshold,
            metrics.maxMentions,
            metrics.maxVelocity,
          ),
          markLine: createMarkLine(
            metrics.mentionThreshold,
            metrics.velocityThreshold,
          ),
        },
      ],
    };
  }, [data, metrics]);
  return (
    <Stack>
      <EChartContainer option={chartOption} height={height} />
      <DeepVelocityLegend />
    </Stack>
  );
};

export default DeepVelocityChart;