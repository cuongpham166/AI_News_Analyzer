import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import {getConnectionStabilityData} from './connectionStability.utils.ts';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import { createDataZoom } from '@/shared/utils/chartConfig.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface ConnectionStabilityProps {
  powerCouple?: PowerCouple[];
  height?: number | string;
}

const ConnectionStability = ({
  powerCouple,
  height = 420,
}: ConnectionStabilityProps) => {
  const hasData = powerCouple && powerCouple.length > 0;
  let connectionStabilityData = [];
  if (hasData) {
    connectionStabilityData = getConnectionStabilityData(powerCouple);
  }

  const chartOption = useMemo<EChartsOption| undefined>(() => {
    if(!hasData) {
      return undefined;
    }
    return {
      tooltip: {
        formatter: ({ data }) => {
          return `
        <strong>${data.person}</strong><br/>
        ${data.organization}<br/>
        Sentiment: ${data.value[0].toFixed(2)}<br/>
        Volatility: ${data.value[1].toFixed(2)}
      `;
        },
      },
      grid: {
        left: 60,
        right: 30,
        top: 30,
        bottom: 60,
      },
      dataZoom: createDataZoom('x'),
      xAxis: {
        type: 'value',
        min: 0,
        max: 1,
        name: 'Avg. sentiment',
      },

      yAxis: {
        type: 'value',
        name: 'Volatility',
      },

      series: [
        {
          type: 'scatter',
          symbolSize: 12,
          data: connectionStabilityData,
        },
      ],
    };
  }, [connectionStabilityData]);

  return (
    <DashboardSection
      title='Connection stability'
      description='Compare sentiment and volatility to identify consistent and unpredictable relationships.'
      children={
        <Flex direction='column' h='100%' gap='sm'>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {hasData && chartOption ? (
              <EChartContainer option={chartOption} height={height} />
            ) : (
              <EmptyDataCard
                title='No data available'
                description='No data were found.'
              />
            )}
          </Box>
        </Flex>
      }
    />
  );
};

export default ConnectionStability;
