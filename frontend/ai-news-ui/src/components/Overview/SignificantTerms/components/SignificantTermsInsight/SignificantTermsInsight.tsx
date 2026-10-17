import React, { useMemo, useState } from 'react';
import {
  Group,
  SegmentedControl,
  Stack,
  Text,
  Box,
  Flex,
  Divider,
  Select,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import {
  SignificantTermsInsightLegend,
} from '@/components/Overview/SignificantTerms/components/SignificantTermsInsight/components';
import type { SignificantTerms } from '@/shared/types/analysis';
import type { EChartsOption } from 'echarts';
import EChartContainer from '@/components/generic/EChartContainer';
import {
  buildAxis,
  buildMarkline,
  buildMarkArea,
} from './significantTermsInsight.utils.ts';
import {
  GRID,
  ZOOM,
  SECTION_CONFIG,
} from './significantTermsInsight.config.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
import DashboardSection from '@/components/generic/DashboardSection';
import SignificantTermsLegend from '@/components/Overview/SignificantTerms/components/SignificantTermsLegend.tsx';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { GRID_CONFIG } from '@/shared/utils/chartConfig.ts';
import { createCustomChartTooltip } from '@/shared/utils/createChartTooltip.ts';

interface SignificantTermsInsightProps {
  data?: SignificantTerms[];
  height?: number | string;
}

const SignificantTermsInsight = ({ data, height = 450 }:SignificantTermsInsightProps) => {
  const [metric, setMetric] = useState<'all' | 'person' | 'organization' | 'event' | 'location'>('all');
  const terms = data ?? [];
  const hasData = (data?.length ?? 0) > 0;

  const chartOption = useMemo<EChartsOption | undefined>(() => {
    if (!hasData) {
      return undefined;
    }

    const { xAxis, yAxis } = buildAxis(data);

    const filteredSignificantTermsInsightData =
      metric === 'all'
        ? terms
        : terms.filter((term) => term.entityType === metric);

    return {
      dataZoom: ZOOM,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const d = params.data.raw;
          const customContent = `
            <div style="
              display:flex;
              justify-content:space-between;
              gap:12px;
              margin-bottom:5px;
            ">
              <span style="color:#475569;">Mentions</span>
              <strong style="text-align:right;white-space:nowrap;">${d.docCount}</strong>
            </div>
            <div style="
              display:flex;
              justify-content:space-between;
              gap:12px;
              margin-bottom:5px;
            ">
              <span style="color:#475569;">Significance</span>
              <strong style="text-align:right;white-space:nowrap;">${d.score.toFixed(3)}</strong>
            </div>
          `;
          return createCustomChartTooltip({
            title: d.term,
            minWidth: 260,
            badge: String(d.entityType).toUpperCase(),
            badgeBgColor: NEWS_ENTITY_COLORS[d.entityType],
            customContent: customContent,
          });
        },
      },

      grid: GRID_CONFIG,
      xAxis: xAxis,
      yAxis: yAxis,

      series: [
        {
          type: 'scatter',

          symbolSize: (value: number[]) => {
            return Math.max(12, value[0] * 2);
          },

          data: filteredSignificantTermsInsightData.map((item) => ({
            value: [item.docCount, item.score],
            raw: item,
            itemStyle: {
              color: NEWS_ENTITY_COLORS[item.entityType],
            },
            label: {
              show: true,
              position: 'top',
              formatter: item.term,
              fontSize: 11,
            },
          })),

          markLine: buildMarkline(data),
          markArea: buildMarkArea(data),
        },
      ],
    };
  }, [data, hasData, metric]);
  return (
    <DashboardSection
      title={SECTION_CONFIG.title}
      description={SECTION_CONFIG.description}
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
      children={
        <Flex direction='column' h='100%' gap='sm'>
          {hasData && chartOption ? (
            <>
              <Box style={{ flex: 1, minHeight: 0 }}>
                <EChartContainer option={chartOption} height={height} />
              </Box>
              <Stack>
                <SignificantTermsLegend />
                <Divider />
                <SignificantTermsInsightLegend />
              </Stack>
            </>
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No significant terms were found for this selection.'
              height={height}
            />
          )}
        </Flex>
      }
    />
  );
};


export default SignificantTermsInsight;