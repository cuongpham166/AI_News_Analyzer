import React, { useMemo } from 'react';
import type { EChartsOption } from 'echarts';
import { createDataZoom } from '@/shared/utils/chartConfig.ts';
import type { GlobalEntitiesTrends } from '@/shared/types/analysis';

export interface HeatmapItemData {
  dates: string[];
  entities: string[];
  chartData: Array<
    [number, number, number, number, number, number, number, string]
  >;
}

export const getEntitiesHeatmapData = (
  data?: GlobalEntitiesTrends,
  topLimit: number = 20,
): HeatmapItemData => {
  if (!data?.timeline) {
    return { dates: [], entities: [], chartData: [] };
  }

  const dateSet = new Set<string>();
  const entityTotals: Record<string, number> = {};

  // First Pass: Extract unique dates and calculate total entity mention volume
  Object.entries(data.timeline).forEach(([date, items]) => {
    dateSet.add(date);
    items.forEach((item) => {
      entityTotals[item.name] = (entityTotals[item.name] || 0) + item.count;
    });
  });

  const dates = Array.from(dateSet).sort();

  const entities = Object.keys(entityTotals)
    .sort((a, b) => entityTotals[b] - entityTotals[a])
    .slice(0, topLimit);

  const chartData: HeatmapItemData['chartData'] = [];

  Object.entries(data.timeline).forEach(([date, items]) => {
    const xIndex = dates.indexOf(date);
    if (xIndex === -1) return;

    items.forEach((item) => {
      const yIndex = entities.indexOf(item.name);
      if (yIndex !== -1) {
        chartData.push([
          xIndex,
          yIndex,
          item.count,
          item.averageSentiment,
          item.riskScore,
          item.positiveVolume,
          item.negativeVolume,
          item.type,
        ]);
      }
    });
  });

  return { dates, entities, chartData };
};
