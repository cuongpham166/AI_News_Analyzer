import type { SeriesOption } from 'echarts';
import type { DeepVelocityType } from '@/shared/interfaces/analysis/ExecutiveOverview/DeepVelocityType.ts';

export const TRENDS_COLORS: Record<DeepVelocityType['trendDirection'], string> =
  {
    Rising: '#3BA272',
    Falling: '#EE6666',
    Stable: '#868e96',
  };

export const DEFAULT_TRENDS_COLORS = '#000000';

export const GRID = {
  top: 30,
  right: 40,
  bottom: 50,
  left: 50,
};

export const DATA_ZOOM = [
  {
    type: 'inside',
    xAxisIndex: 0,
    filterMode: 'empty',
  },
  {
    type: 'inside',
    yAxisIndex: 0,
    filterMode: 'empty',
  },
];

