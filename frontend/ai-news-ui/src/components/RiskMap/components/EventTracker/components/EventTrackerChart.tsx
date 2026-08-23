import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';

import type { EventTracker } from '@/shared/types/analysis/risk_map/EventTracker.ts';

interface EventTrackerChartProps {
  event?: EventTracker[];
  height?: number | string;
}
const EventTrackerChart = (props: EventTrackerChartProps) => {
  const {event, height = 500 } = props;

  const chartOption = useMemo<EChartsOption>(() => {
    return {
      geo: {
        map: 'world',
        roam: true,

        itemStyle: {
          areaColor: '#e5e5e5',
          borderColor: '#334155',
          borderWidth: 0.5,
        },

        emphasis: {
          itemStyle: {
            areaColor: '#243047',
          },

          label: {
            show: true,
            color: '#ffffff',
            fontWeight: 'bold',
          },
        },
      },

      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const item = params.data;

          if (!item) {
            return params.name;
          }

          return `
            <div>
              <strong>${item.event}</strong>
              <br />
              Location: ${item.location}
              <br />
              Country: ${item.country || 'Unknown'}
              <br />
              Articles: ${item.strength.toLocaleString()}
              <br />
              Sentiment: ${item.avgSentiment.toFixed(2)}
              <br />
              Volatility: ${item.volatility.toFixed(2)}
            </div>
          `;
        },
      },

      series: [
        {
          name: 'Events',
          type: 'scatter',
          coordinateSystem: 'geo',

          data: event ? event.map((item) => ({
            name: item.event,
            value: [item.longitude, item.latitude, item.strength],
            ...item,
          })): [],

          symbolSize: (value: any) => {
            const strength = value[2];

            return Math.max(8, Math.sqrt(strength) * 8);
          },

          itemStyle: {
            color: '#f97316',
            opacity: 0.85,
          },

          emphasis: {
            scale: true,

            itemStyle: {
              borderColor: '#ffffff',
              borderWidth: 2,
            },
          },
        },
      ],
    };
  }, [event]);
  return <EChartContainer option={chartOption} height={height} />;
};

export default EventTrackerChart;
