import type { EchoChamber } from '@/shared/types/analysis/EchoChamber.ts';
import { useMemo } from 'react';
import DashboardSection from '@/components/generic/DashboardSection';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';

interface ContentDistributionProps {
  data: EchoChamber[];
  height?: number;
}

const ContentDistribution = ({
  data,
  height = 420,
}: ContentDistributionProps) => {
  const publisherData = useMemo(() => {
    const counts = new Map<string, number>();

    for (const item of data) {
      for (const publisher of item.publishers) {
        counts.set(
          publisher.publisher,
          (counts.get(publisher.publisher) ?? 0) + publisher.articleCount,
        );
      }
    }

    return [...counts.entries()]
      .map(([publisher, articleCount]) => ({
        publisher,
        articleCount,
      }))
      .sort((a, b) => b.articleCount - a.articleCount);
  }, [data]);

  const chartOption = useMemo(() => {
    return {
      animationDuration: 500,

      grid: {
        left: 100,
        right: 60,
        top: 20,
        bottom: 40,
      },

      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },

        formatter: (params: any[]) => {
          const item = publisherData[params[0].dataIndex];

          return `
            <strong>${item.publisher}</strong>
            <br/>
            Articles:
            <strong>${item.articleCount}</strong>
          `;
        },
      },

      xAxis: {
        type: 'value',
        name: 'Articles',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        minInterval: 1,
      },

      yAxis: {
        type: 'category',
        inverse: true,
        data: publisherData.map((item) => item.publisher),
      },

      series: [
        {
          type: 'bar',

          data: publisherData.map((item) => item.articleCount),

          barMaxWidth: 28,

          itemStyle: {
            color: '#74c0fc',
            borderRadius: [0, 5, 5, 0],
          },

          label: {
            show: true,
            position: 'right',
            formatter: '{c}',
          },
        },
      ],
    };
  }, [publisherData]);

  return (
    <DashboardSection
      title='Repeated Content'
      description='See which stories appear multiple times and how widely they are duplicated across publishers.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default ContentDistribution