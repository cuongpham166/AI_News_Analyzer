import ReactECharts from 'echarts-for-react';
import { Box } from '@mantine/core';
import type { EChartsOption } from 'echarts';

interface Props {
  option: EChartsOption;
  height?: number | string;
  loading?: boolean;
  onEvents?: Record<string, (params: any, instance?: any) => void>;
}

function EChartContainer({
  option,
  height = 400,
  loading = false,
  onEvents,
}: Props) {
  return (
    <Box h={height} w='100%'>
      <ReactECharts
        option={option}
        onEvents={onEvents}
        style={{ height: '100%', width: '100%' }}
        showLoading={loading}
        notMerge={true}
      />
    </Box>
  );
}

export default EChartContainer;