import ReactECharts from 'echarts-for-react';
import { Box } from '@mantine/core';
import type { EChartsOption } from 'echarts';

interface Props {
  option: EChartsOption;
  height?: number | string;
  loading?: boolean;
}

function EChartContainer({
  option,
  height = 400,
  loading = false,
}: Props) {
  return (
    <Box h={height} w='100%'>
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        showLoading={loading}
        // notMerge ensures that when options/filters change, old chart elements clear automatically
        notMerge={true}
      />
    </Box>
  );
}

export default EChartContainer;