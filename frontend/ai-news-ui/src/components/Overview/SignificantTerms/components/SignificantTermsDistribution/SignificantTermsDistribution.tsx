import DashboardSection from '@/components/generic/DashboardSection';
import {
  Box,
  Flex,
  Group,
  SegmentedControl,
  Select,
  Text,
} from '@mantine/core';
import type { SignificantTerms } from '@/shared/types/analysis';
import {
  getSignificantTermsDistributionData,
  type SignificantTermsDistributionType,
} from '@/components/Overview/SignificantTerms/components/SignificantTermsDistribution/significantTermsDistribution.utils.ts';
import EChartContainer from '@/components/generic/EChartContainer';
import React, { useMemo, useState } from 'react';
import type { EChartsOption } from 'echarts';
import {NEWS_ENTITY_COLORS, NEWS_ENTITIES} from '@/shared/constants/NewsEntities.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import {
  SECTION_CONFIG
} from '@/components/Overview/SignificantTerms/components/SignificantTermsInsight/significantTermsInsight.config.ts';
import SignificantTermsLegend from '@/components/Overview/SignificantTerms/components/SignificantTermsLegend.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';

interface SignificantTermsDistributionProps {
  data?: SignificantTerms[];
  height?: number | string;
}

const SignificantTermsDistribution = ({
  data,
  height = 450,
}: SignificantTermsDistributionProps) => {
  const [metric, setMetric] = useState<
    'all' | 'person' | 'organization' | 'event' | 'location'
  >('all');

  const terms = data ?? [];

  const filteredTerms =
    metric === 'all'
      ? terms
      : terms.filter((term) => term.entityType === metric);

  const hasData = filteredTerms.length > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    const distributionData: SignificantTermsDistributionType[] =
      getSignificantTermsDistributionData(filteredTerms);

    if (distributionData.length === 0) {
      return undefined;
    }

    const sizes = distributionData.map((item) => item.size);
    const maxSize = Math.max(...sizes);

    const getBubbleSize = (size: number) => {
      if (!maxSize) return 10;

      const normalized = Math.log1p(size) / Math.log1p(maxSize);

      return 8 + normalized * 32;
    };

    const groups = new Map<string, SignificantTermsDistributionType[]>();

    distributionData.forEach((item) => {
      const key = `${item.docCount}-${item.score}`;

      if (!groups.has(key)) {
        groups.set(key, []);
      }

      groups.get(key)!.push(item);
    });

    const createSeriesData = (type: string) => {
      return distributionData
        .filter((item) => item.type === type)
        .map((item) => {
          const key = `${item.docCount}-${item.score}`;
          const group = groups.get(key)!;

          const index = group.indexOf(item);
          const count = group.length;

          let x = item.docCount;
          let y = item.score;

          if (count > 1) {
            const angle = (index / count) * Math.PI * 2;

            x += Math.cos(angle) * 0.15;
            y += Math.sin(angle) * item.score * 0.15;
          }

          return {
            value: [x, y, item.size],
            originalData: item,
          };
        });
    };

    return {
      tooltip: {
        trigger: 'item',

        formatter: (params: any) => {
          const item = params.data
            .originalData as SignificantTermsDistributionType;

          return `
            <strong>${item.term}</strong><br/>
            Mentions: ${item.docCount}<br/>
            Score: ${item.score.toFixed(3)}<br/>
            Size: ${item.size.toFixed(3)}<br/>
            Type: ${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}<br/>
            Historical Share: ${item.historicalSharePercentage}%
          `;
        },
      },

      grid:GRID_CONFIG,

      xAxis: {
        type: 'value',
        name: 'Mentions',
      },

      yAxis: {
        type: 'value',
        name: 'Scores',
      },

      series: NEWS_ENTITIES.map((type) => ({
        name: type,
        type: 'scatter',

        itemStyle: {
          color: NEWS_ENTITY_COLORS[type],
        },

        symbolSize: (value: any) => getBubbleSize(value[2]),

        data: createSeriesData(type),

        emphasis: {
          focus: 'series',
          scale: true,
        },
      })),
    };
  }, [filteredTerms, hasData]);

  return (
    <DashboardSection
      title='Significant Terms Distribution'
      description='Explore significant term by score and document frequency. Bubble size reflects overall importance'
      actions={
        <Group gap='xs'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            View by:
          </Text>

          <Select
            value={metric}
            onChange={(val) =>
              setMetric(
                val as 'all' | 'person' | 'organization' | 'event' | 'location',
              )
            }
            data={SECTION_CONFIG.control_options}
          />
        </Group>
      }
    >
      <Flex direction='column' h='100%' gap='sm'>
        {hasData && chartOption ? (
          <>
            <Box style={{ flex: 1, minHeight: 0 }}>
              <EChartContainer option={chartOption} height={height} />
            </Box>
            <SignificantTermsLegend />
          </>
        ) : (
          <EmptyDataCard
            title='No data available'
            description='No significant terms were found for this selection.'
            height={height}
          />
        )}
      </Flex>
    </DashboardSection>
  );
};


export default SignificantTermsDistribution;