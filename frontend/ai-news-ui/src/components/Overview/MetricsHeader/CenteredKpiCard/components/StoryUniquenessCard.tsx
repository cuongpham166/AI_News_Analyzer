import type StoryUniqueness from '@/shared/types/analysis/macro_pulse/StoryUniqueness.ts';
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
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';

interface StoryUniquenessProps {
  totalArticles: number;
  uniqueStories:number;
  height?: number | string;
}
const StoryUniquenessCard = ({
  totalArticles,
  uniqueStories,
  height = 250,
}: StoryUniquenessProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const centerY = '65%';
    const startAngle = 180;
    const endAngle = 0;
    const textTop = '44%';
    const duplicated = totalArticles - uniqueStories;
    return {
      title: {
        text: `${totalArticles}`,
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
          label: { show: false },
          data: [
            { value: uniqueStories, name: 'Unique Stories' },
            { value: duplicated, name: 'Syndicated / Duplicate' },
          ],
        },
      ],
    };
  }, [totalArticles, uniqueStories]);
  return (
    <Box h={height} w='100%'>
      <EChartContainer option={chartOption} height={height} />
    </Box>
  );
};

export default StoryUniquenessCard