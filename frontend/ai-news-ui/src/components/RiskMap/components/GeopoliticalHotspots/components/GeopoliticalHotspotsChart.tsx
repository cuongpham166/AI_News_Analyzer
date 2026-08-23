import * as echarts from 'echarts';
import worldGeoJson from '@/assets/maps/world.json'
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import React, { useMemo } from 'react';
import type { GeopoliticalHotspot } from '@/shared/types/analysis/risk_map/GeopoliticalHotspot.ts';
import { Stack,Text } from '@mantine/core';

echarts.registerMap('world', worldGeoJson);

interface HotspotChartData {
  name: string;
  value: [number, number, number];
  location: string;
  topic: string;
  articleCount: number;
  country: string;
}

interface GeopoliticalHotspotsChartsProps {
  geoHotspot?: GeopoliticalHotspot[];
  height?: number | string;
}

const GeopoliticalHotspotsCharts = (props: GeopoliticalHotspotsChartsProps) => {
  const { geoHotspot, height = 500 } = props;
  let seriesData = [];

  if (geoHotspot) {
    seriesData = geoHotspot.map(
      (item): HotspotChartData => ({
        name: item.location,
        value: [item.longitude, item.latitude, item.articleCount],
        location: item.location,
        topic: 'N/A',
        articleCount: item.articleCount,
        country: item.country,
      }),
    );
  }

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

      series: [
        {
          name: 'Hotspots',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: seriesData,
          symbolSize: (value: number[]) => {
            return Math.max(8, Math.sqrt(value[2]) * 10);
          },

          itemStyle: {
            color: '#f97316',
            opacity: 0.85,
          },
        },
      ],

      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const data = params.data as HotspotChartData;

          return `
        <div>
          <strong>${data.location}</strong>
          <div>${data.country}</div>
          <br />
          <div><strong>${data.articleCount}</strong> articles</div>
          <div>Topic: ${data.topic}</div>
        </div>
      `;
        },
      },
    };
  }, [seriesData]);
  return (
    <Stack>
      <EChartContainer option={chartOption} height={height} />
      <Text c='red.4'>Top 50 locations by article volume.</Text>
    </Stack>
  );
};

export default GeopoliticalHotspotsCharts;
