import type { EChartsOption } from 'echarts';

export const GRID_CONFIG = {
  top: 10,
  left: 20,
  right: 20,
  bottom: 5,
};
export const createDataZoom = (
  axis: 'x' | 'y' | 'both',
  start = 80,
  end = 100,
): EChartsOption['dataZoom'] => {
  const zooms: EChartsOption['dataZoom'] = [];

  if (axis === 'x' || axis === 'both') {
    zooms.push(
      {
        type: 'slider',
        xAxisIndex: 0,
        start,
        end,
        height: 18,
        bottom: 10,
        backgroundColor: '#f1f3f5',
        fillerColor: 'rgba(34, 139, 230, 0.25)',
        handleSize: '120%',
        handleStyle: {
          color: '#228be6',
          borderColor: '#1864ab',
          borderWidth: 1,
        },
        borderColor: '#ced4da',
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        start,
        end,
      },
    );
  }

  if (axis === 'y' || axis === 'both') {
    zooms.push(
      {
        type: 'slider',
        yAxisIndex: 0,
        start,
        end,
        width: 18,
        right: 8,
        backgroundColor: '#f1f3f5',
        fillerColor: 'rgba(34, 139, 230, 0.25)',
        handleSize: '120%',
        handleStyle: {
          color: '#228be6',
          borderColor: '#1864ab',
          borderWidth: 1,
        },
        borderColor: '#ced4da',
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        start,
        end,
      },
    );
  }

  return zooms;
};
