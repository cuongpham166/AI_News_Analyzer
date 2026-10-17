import EventMomentum from '@/components/NetworkLab/EventMomentum';
import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import {
  truncateLabel,
} from '@/components/NetworkLab/EventMomentum/eventMomentum.utils.ts';
import { createCustomChartTooltip, escapeHtml } from '@/shared/utils/createChartTooltip.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

interface EventMomentumChartProps {
  eventMomentum?: EventMomentum[];
  height?: number | string;
  limit:string;
}
const EventMomentumChart = ({
  eventMomentum,height = 650,limit
}: EventMomentumChartProps) => {
  const hasData = Boolean(eventMomentum && eventMomentum.length > 0);

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData || !eventMomentum) {
      return undefined;
    }

    const chartData = [...eventMomentum]
      .sort((a, b) => b.totalVolume - a.totalVolume)
      .slice(0, Number(limit));

    if (!chartData.length) {
      return undefined;
    }

    // Extract sorted unique dates (X Axis)
    const dates = [
      ...new Set(
        chartData.flatMap((event) => event.timeline.map((item) => item.date)),
      ),
    ].sort();

    const events = chartData.map((item) => item.event);

    const heatmapData: Array<[number, number, number, number, number]> = [];

    chartData.forEach((event, yIdx) => {
      // Map existing timeline items
      const timelineMap = new Map(
        event.timeline.map((item) => [item.date, item]),
      );

      dates.forEach((date, xIdx) => {
        const item = timelineMap.get(date);
        if (item) {
          heatmapData.push([
            xIdx,
            yIdx,
            item.volume ?? 0,
            item.positiveVolume ?? 0,
            item.negativeVolume ?? 0,
          ]);
        } else {
          heatmapData.push([xIdx, yIdx, 0, 0, 0]);
        }
      });
    });

    const maxVolume = Math.max(
      ...chartData.flatMap((event) =>
        event.timeline.map((item) => item.volume),
      ),
      1,
    );

    return {
      animationDuration: 500,

      grid: {
        top: 20,
        right: 30,
        bottom: 90,
        left: 20,
        containLabel: true,
      },

      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: [10, 12],
        extraCssText:
          'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px;',

        formatter: (params: any) => {
          const [dateIdx, eventIdx, volume, posVol, negVol] = params.value;
          const eventName = events[eventIdx];
          const dateStr = dates[dateIdx];

          if (volume === 0) {
            return `
              <div style="font-family: sans-serif; font-size: 12px; color: #64748B;">
                <strong>${escapeHtml(eventName)}</strong><br/>
                <span>${dateStr}</span>: No recorded volume
              </div>
            `;
          }

          const posPct = Math.round((posVol / volume) * 100);
          const negPct = Math.round((negVol / volume) * 100);

          return createCustomChartTooltip({
            title: escapeHtml(eventName),
            subtitle: dateStr,
            metrics: [
              {
                label: 'Positive Articles',
                value: `${posVol}`,
                color: NEWS_SENTIMENT_COLORS['positive'],
              },
              {
                label: 'Negative Articles',
                value: `${negVol}`,
                color: NEWS_SENTIMENT_COLORS['negative'],
              },
              {
                label: 'Total Articles',
                value: `${volume}`,
              },
            ],
            distribution: {
              segments: [
                {
                  label: 'Pos',
                  percentage: posPct,
                  color: NEWS_SENTIMENT_COLORS['positive'],
                },
                {
                  label: 'Conflict',
                  percentage: negPct,
                  color: NEWS_SENTIMENT_COLORS['negative'],
                },
              ],
            },
          });
        },
      },

      xAxis: {
        type: 'category',
        data: dates,
        splitArea: { show: true },
        axisLine: { lineStyle: { color: '#CBD5E1' } },
        axisLabel: {
          color: '#475569',
          fontSize: 11,
          formatter: (value: string) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) return value;
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
        splitArea: { show: true },
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          width: 170,
          overflow: 'truncate',
          ellipsis: '…',
          color: '#334155',
          fontSize: 12,
          fontWeight: 500,
          formatter: (value: string) => truncateLabel(value, 26),
        },
      },

      visualMap: {
        min: 0,
        max: maxVolume,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        text: ['High Coverage', 'Low Coverage'],
        textStyle: { color: '#64748B', fontSize: 11 },
        inRange: {
          color: ['#F8FAFC', '#DBEAFE', '#60A5FA', '#2563EB', '#1E3A8A'],
        },
      },

      series: [
        {
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            color: '#1E293B',
            fontSize: 11,
            formatter: (params: any) =>
              params.value[2] > 0 ? String(params.value[2]) : '',
          },
          itemStyle: {
            borderColor: '#FFFFFF',
            borderWidth: 1.5,
            borderRadius: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              borderColor: '#0F172A',
              borderWidth: 1.5,
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