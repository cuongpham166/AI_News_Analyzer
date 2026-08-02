import React, { useMemo } from 'react';
import type { TimelineBucket } from '@/shared/interfaces/analysis/ExecutiveOverview/DateHistogramSentimentTrendType.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import type { EChartsOption } from 'echarts';
import {
  formatTimestamp,
  getSentimentTrendData,
  type SentimentTrendData,
} from '@/components/Overview/PrimaryMacroTrends/DateHistogramSentimentTrend/components/SentimentTrendChart/sentimentTrend.utils.ts';

interface SentimentTrendChartProps {
  data: TimelineBucket[];
  height?: number | string;
}

const SentimentTrendChart = ({
  data,
  height = 420,
}: SentimentTrendChartProps) => {
  const chartOption = useMemo<EChartsOption>(() => {
    const sentimentTrendData: SentimentTrendData[] =
      getSentimentTrendData(data);

    const dates = sentimentTrendData.map((item) => formatTimestamp(item.timestamp));
    const seriesData = sentimentTrendData.map((item)=>item.averageSentiment);
    return {
      xAxis: {
        type: 'category',
        data: dates,
      },
      yAxis: {
        type: 'value',
        name: 'Average Sentiment',
      },

      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const point = params[0];
          return `
            <strong>${point.axisValue}</strong><br/>
            Average Sentiment: ${Number(point.value).toFixed(3)}
        `;
        },
      },
      series: [
        {
          data: seriesData,
          type: 'line',
          smooth: true,
        },
      ],
    };
  }, [data]);
  return <EChartContainer option={chartOption} height={height} />;
};

export default SentimentTrendChart;