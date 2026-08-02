import type { SignificantTermsType } from '@/shared/interfaces/analysis/ExecutiveOverview/SignificantTermsType.ts';
import type { TopicRadarLegendTooltip, TopicTooltipItem } from '@/shared/interfaces/analysis/ExecutiveOverview/TopicRadarType.ts';
import { Paper, Text, Stack, Group } from '@mantine/core';
import React from 'react';

interface CustomChartLegendTooltipProps {
  data: TopicRadarLegendTooltip;
}

const CustomChartLegendTooltip = ({ data }: CustomChartLegendTooltipProps) => {
  return (
    <Paper
      p='sm'
      radius='sm'
      style={{
        minWidth: 180,
      }}
    >
      <Text size='sm' fw={600} mb='xs'>
        {data.title}
      </Text>

      <Stack gap={4}>
        {data.items.map((item) => (
          <Group key={item.name} justify='space-between' wrap='nowrap'>
            <Text size='sm' c='dimmed'>
              {item.name}
            </Text>

            <Text size='sm' fw={500}>
              {item.value}
            </Text>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
};



export default CustomChartLegendTooltip;