import DashboardSection from '@/components/generic/DashboardSection';
import type { PowerCouple } from '@/shared/types/analysis/PowerCouple.ts';
import {getConnectionNetworkData} from './connectionNetwork.utils.tsx';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';

interface ConnectionNetworkProps {
  data: PowerCouple[];
  height?: number | string;
}

const ConnectionNetwork = ({ data, height = 420 }: ConnectionNetworkProps) => {
  const { people, organizations, links, nodes } =
    getConnectionNetworkData(data);
  const chartOption = useMemo<EChartsOption>(() => {
    return {
      tooltip: {},
      legend: {
        data: ['Person', 'Organization'],
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          roam: true,
          draggable: true,

          data: nodes,

          links,

          categories: [{ name: 'Person' }, { name: 'Organization' }],

          force: {
            repulsion: 300,
            edgeLength: [80, 160],
            gravity: 0.15,
          },

          lineStyle: {
            width: 2,
            opacity: 0.8,
            curveness: 0.1,
          },

          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: 4,
            },
          },

          label: {
            show: true,
            position: 'right',
            formatter: '{b}',
            fontSize: 11,
          },
        },
      ],
    };
  }, [
    people,
    organizations,
    links,
    nodes,
  ]);
  return (
    <DashboardSection
      title='Connection network'
      description='Explore the links between people and organizations and discover shared connections.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};


export default ConnectionNetwork;