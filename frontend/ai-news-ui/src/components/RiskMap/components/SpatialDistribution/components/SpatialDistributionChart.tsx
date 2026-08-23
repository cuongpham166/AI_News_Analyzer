import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';

import type { SpatialMap } from '@/shared/types/analysis/risk_map/SpatialMap.ts';

interface SpatialDistributionChartProps {
  spatialMap?: SpatialMap[];
  height?: number | string;
}
const SpatialDistributionChart = (props: SpatialDistributionChartProps) => {
  const {spatialMap, height = 500 } = props;

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
          const data = params.data;

          if (!data) {
            return params.name;
          }

          return `
        <div>
          <strong>${data.location}</strong>
          <br />
          Articles: ${data.count.toLocaleString()}
          <br />
          Country: ${data.country || 'Unknown'}
          <br />
          Sentiment: ${data.avgSentiment.toFixed(2)}
        </div>
    `;
        },
      },

      series: [
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          data: spatialMap ? spatialMap.map((item) => ({
            name: item.location,
            value: [item.longitude, item.latitude, item.count],
            ...item,
          })) : [],

          symbolSize: (value) => {
            const count = value[2];
            return Math.max(8, Math.sqrt(count) * 8);
          },

          itemStyle: {
            color: '#f97316',
            opacity: 0.85,
          },
        },
      ],
    };
  }, [spatialMap]);
    return <EChartContainer option={chartOption} height={height} />;
}

export default SpatialDistributionChart;