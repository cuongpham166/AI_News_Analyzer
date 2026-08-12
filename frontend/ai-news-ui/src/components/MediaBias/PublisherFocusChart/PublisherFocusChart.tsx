import type { PublisherFocus } from '@/shared/types/analysis/PublisherFocus.ts';
import React, { useMemo } from 'react';
import DashboardCard from '@/components/generic/DashboardCard';
import { Box, Flex } from '@mantine/core';
import EChartContainer from '@/components/generic/EChartContainer';

interface PublisherFocusChartProps {
  data: PublisherFocus[];
  height?: number | string;
}

const PublisherFocusChart = ({ data, height = 450 }:PublisherFocusChartProps) => {
  const chartOption = useMemo(() => {
    if (!data.length) {
      return {
        title: {
          text: 'No publisher coverage data',
          left: 'center',
          top: 'middle',
        },
      };
    }

    const TOP_N = 7;
    const organizationTotals = new Map<string, number>();

    data.forEach((item) => {
      organizationTotals.set(
        item.organization,
        (organizationTotals.get(item.organization) ?? 0) + item.coverageVolume,
      );
    });

    const topOrganizations = [...organizationTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_N)
      .map(([organization]) => organization);

    const topSet = new Set(topOrganizations);

    const groupedData = new Map<string, Map<string, number>>();

    data.forEach((item) => {
      const organization = topSet.has(item.organization)
        ? item.organization
        : 'Other';

      if (!groupedData.has(item.publisher)) {
        groupedData.set(item.publisher, new Map());
      }

      const publisherData = groupedData.get(item.publisher)!;

      publisherData.set(
        organization,
        (publisherData.get(organization) ?? 0) + item.coverageVolume,
      );
    });

    const publishers = [...groupedData.keys()];

    const organizations = [...topOrganizations, 'Other'];


    const series = organizations.map((organization) => ({
      name: organization,
      type: 'bar',
      stack: 'coverage',
      barMaxWidth: 40,
      data: publishers.map(
        (publisher) => groupedData.get(publisher)?.get(organization) ?? 0,
      ),
      emphasis: {
        focus: 'series',
      },
      itemStyle: {
        borderColor: 'transparent',
        borderWidth: 1,
      },
    }));

    return {
      animationDuration: 500,
      grid: {
        left: 80,
        right: 50,
        top: 30,
        bottom: 80,
      },

      tooltip: {
        trigger: 'item',

        formatter: (params: any) => {
          const publisher = publishers[params.dataIndex];

          const organization = params.seriesName;

          const value = groupedData.get(publisher)?.get(organization) ?? 0;

          return `
          <strong>${organization}</strong><br/>
          Publisher: ${publisher}<br/>
          Coverage volume: <strong>${value}</strong>
        `;
        },
      },

      legend: {
        type: 'scroll',
        bottom: 0,
        left: 'center',

        data: organizations,
      },

      xAxis: {
        type: 'value',

        name: 'Coverage volume',
        nameLocation: 'middle',
        nameGap: 30,

        min: 0,
        minInterval: 1,

        splitLine: {
          lineStyle: {
            type: 'dashed',
            opacity: 0.35,
          },
        },
      },

      yAxis: {
        type: 'category',
        inverse: true,

        data: publishers,

        axisTick: {
          show: false,
        },
      },

      series,
    };
  }, [data]);
  return (
    <DashboardCard
      title='Publisher Focus'
      description='Compare the organizations most frequently covered by each publisher and identify differences in coverage concentration.'
      children={
        <Flex direction='column' h='100%'>
          <EChartContainer option={chartOption} height={height} />
          <Box mt='auto'></Box>
        </Flex>
      }
    />
  );
};

export default PublisherFocusChart