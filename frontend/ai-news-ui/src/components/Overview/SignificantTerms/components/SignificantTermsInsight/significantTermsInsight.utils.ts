import type { SignificantTerms } from '@/shared/types/analysis';

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
};

export function calculateChartMetrics(data: SignificantTerms[]){
  const medianDocCount = median(data.map((d) => d.docCount));
  const medianScore = median(data.map((d) => d.score));

  const maxDoc = Math.max(...data.map((d) => d.docCount));
  const maxScore = Math.max(...data.map((d) => d.score));
  const yMax = Math.ceil(maxScore * 10) / 10;
  return { medianDocCount, medianScore, maxDoc, maxScore, yMax };
}

export function buildAxis(data: SignificantTerms[]) {
  const {maxDoc, yMax} = calculateChartMetrics(data);
  const xAxis = {
    type: 'value',
    name: 'Mentions',
    min: 0,
    max: maxDoc + 2,
  }

  const yAxis = {
    type: 'value',
    name: 'Significance',
    min: 0,
    max: yMax,
  };

  return {xAxis, yAxis};
}

export function buildMarkline(data: SignificantTerms[]) {
  const {medianDocCount, medianScore} = calculateChartMetrics(data);
  return {
    silent: true,
    symbol: 'none',
    lineStyle: {
      color: '#999',
      type: 'dashed',
      width: 1.5,
    },
    data: [{ xAxis: medianDocCount }, { yAxis: medianScore }],
  };
}
export function buildMarkArea(data: SignificantTerms[]) {
  const { medianDocCount, medianScore, maxDoc, maxScore } =
    calculateChartMetrics(data);

  return {
    silent: true,
    itemStyle: {
      opacity: 0.08,
    },
    data: [
      // Trending
      [
        {
          xAxis: medianDocCount,
          yAxis: medianScore,
          itemStyle: { color: '#4CAF50' },
        },
        {
          xAxis: maxDoc + 2,
          yAxis: maxScore * 1.1,
        },
      ],

      // Emerging
      [
        {
          xAxis: 0,
          yAxis: medianScore,
          itemStyle: { color: '#2196F3' },
        },
        {
          xAxis: medianDocCount,
          yAxis: maxScore * 1.1,
        },
      ],

      // Common
      [
        {
          xAxis: medianDocCount,
          yAxis: 0,
          itemStyle: { color: '#FFC107' },
        },
        {
          xAxis: maxDoc + 2,
          yAxis: medianScore,
        },
      ],

      // Niche
      [
        {
          xAxis: 0,
          yAxis: 0,
          itemStyle: { color: '#9E9E9E' },
        },
        {
          xAxis: medianDocCount,
          yAxis: medianScore,
        },
      ],
    ],
  };
}