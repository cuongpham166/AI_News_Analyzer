import { Box } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import {
  TEXT_STYLE,
  SUBTEXT_STYLE,
  LEGEND,
  TOOLTIP,
} from './kpiChart.config.ts';

interface ExtractionPipelineStatusCardProps {
  totalNews: number;
  totalInference: number;
  height?: number | string;
}

const ExtractionPipelineStatusCard = ({
  totalNews, totalInference,
  height = 250,
}: ExtractionPipelineStatusCardProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const centerY = '65%';
    const startAngle = 180;
    const endAngle = 0;
    const textTop = '44%';
    const rawNews = totalNews - totalInference;

    return {
      title: {
        text: `${totalNews}`,
        subtext: 'Total Articles',
        left: 'center',
        top: textTop,
        textStyle: TEXT_STYLE,
        subtextStyle: SUBTEXT_STYLE,
      },
      tooltip: TOOLTIP,
      legend: LEGEND,
      series: [
        {
          type: 'pie',
          radius: ['62%', '92%'],
          center: ['50%', centerY],
          startAngle,
          endAngle,
          avoidLabelOverlap: false,
          label: { show: true },
          data: [
            { value: totalInference, name: 'Analyzed News' },
            { value: rawNews, name: 'Unanalyzed News' },
          ],
        },
      ],
    };
  }, [totalInference, totalNews]);

  return (
    <Box h={height} w='100%'>
      <EChartContainer option={chartOption} height={height} />
    </Box>
  );
};

export default ExtractionPipelineStatusCard;