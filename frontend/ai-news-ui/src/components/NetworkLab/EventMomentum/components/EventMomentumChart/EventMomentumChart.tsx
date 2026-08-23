import EventMomentum from '@/components/NetworkLab/EventMomentum';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface EventMomentumChartProps {
  eventMomentum?: EventMomentum[];
  height?: number | string;
  limit:string;
}
const EventMomentumChart = ({
  eventMomentum,height = 650,limit
}: EventMomentumChartProps) => {
  const hasData = eventMomentum && eventMomentum.length > 0;

  const chartOption = useMemo<EChartsOption|undefined>(() => {
    if(!hasData) {
      return undefined;
    }

    const chartData = eventMomentum
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0,Number(limit))

    const dates = [
      ...new Set(
        chartData.flatMap((event) => event.timeline.map((item) => item.date)),
      ),
    ].sort();

    const events = chartData
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .map((item) => item.event);

    const heatmapData = chartData.flatMap((event) =>
      event.timeline.map((item) => [
        dates.indexOf(item.date),
        events.indexOf(event.event),
        item.volume,
      ]),
    );

    const maxVolume = Math.max(
      ...chartData.flatMap((event) =>
        event.timeline.map((item) => item.volume),
      ),
      0,
    );

    const visualMax = Math.max(maxVolume, 1);

    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const [dateIndex, eventIndex, volume] = params.value;

          return `
        <strong>${events[eventIndex]}</strong><br/>
        ${dates[dateIndex]}<br/>
        News volume: ${volume}
      `;
        },
      },

      grid: {
        left: 190,
        right: 30,
        top: 20,
        bottom: 100,
      },

      xAxis: {
        type: 'category',
        data: dates,
        splitArea: {
          show: true,
        },
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getDate()} ${date.toLocaleString('en', {
              month: 'short',
            })}`;
          },
        },
      },

      yAxis: {
        type: 'category',
        data: events,
        inverse: true,
        splitArea: {
          show: true,
        },
        axisLabel: {
          width: 170,
          overflow: 'truncate',
        },
      },

      visualMap: {
        min: 0,
        max: visualMax,
        calculable: false,
        orient: 'horizontal',
        left: 'center',
        bottom: 15,
        text: ['High coverage', 'No coverage'],
      },

      series: [
        {
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: (params: any) =>
              params.value[2] > 0 ? params.value[2] : '',
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
      ],
    };
  }, [eventMomentum, hasData, limit]);
  return (
    <DashboardSection
      children={
        <Box style={{ flex: 1, minHeight: 0 }}>
          {hasData && chartOption ? (
            <EChartContainer option={chartOption} height={height} />
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No event momentum data were found.'
            />
          )}
        </Box>
      }
    />
  );
};

export default EventMomentumChart;