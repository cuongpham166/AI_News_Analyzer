import React, { useMemo } from 'react';
import { Paper, Text, Box, Stack, Badge } from '@mantine/core';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';

interface AmplificationRatioCardProps {
  data: string;
  height?: number | string;
}
const AmplificationRatioCard = ({ data, height=250 }:AmplificationRatioCardProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const score = parseInt(data);
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 1.0,
          max: 5.0,
          splitNumber: 20,
          center: ['50%', '72%'],
          radius: '90%',
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto',
            },
          },
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.2, '#228be6'],
                [0.5, '#fab005'],
                [1.0, '#fa5252'],
              ],
            },
          },

          axisTick: {
            length: 5,
            lineStyle: {
              color: 'auto',
              width: 2,
            },
          },
          splitLine: {
            length: 10,
            lineStyle: {
              color: 'auto',
              width: 3,
            },
          },

          axisLabel: {
            color: '#464646',
            show: true,
            fontSize: 20,
            distance: -30,
            rotate: 'tangential',
            formatter: (val: number) => {
              const v = Math.round(val * 10) / 10;
              if (v === 1.4) return '{normal|Normal}';
              if (v === 2.4) return '{moderate|Moderate}';
              if (v === 4.0) return '{high|High}';
              return '';
            },

            rich: {
              normal: {
                color: '#228be6',
                fontWeight: '500',
                fontSize: 11,
              },
              moderate: {
                color: '#fab005',
                fontWeight: '500',
                fontSize: 11,
              },
              high: {
                color: '#fa5252',
                fontWeight: '500',
                fontSize: 11,
              },
            },
          },

          title: {
            offsetCenter: [0, '-10%'],
            fontSize: 11,
            fontWeight: 'bold',
          },

          detail: {
            valueAnimation: true,
            offsetCenter: [0, '-30%'],
            fontSize: 20,
            fontWeight: 'bold',
            formatter: (val: number) => `${Number(val).toFixed(1)}`,
            color: 'inherit',
          },
          data: [
            {
              value: score,
              name: 'Amplification Ratio',
            },
          ],
        },
      ],
    };
  }, [data]);
  return (
    <Box h={height} w='100%'>
      <EChartContainer option={chartOption} height={height} />
    </Box>
  );
};

export default AmplificationRatioCard;