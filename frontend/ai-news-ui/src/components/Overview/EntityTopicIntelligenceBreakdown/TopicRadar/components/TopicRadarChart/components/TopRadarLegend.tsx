import {
  ColorSwatch,
  Group,
  SimpleGrid, Stack, Text,
} from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { topicColors } from '@/shared/constants/ChartColors.ts';
import type { TopicRadarType } from '@/shared/interfaces/analysis/ExecutiveOverview/TopicRadarType.ts';

interface TopRadarLegendProps {
  data: TopicRadarType;
  onToggle: (topic: string) => void;
  hiddenTopics:Set<string>;
}
const TopRadarLegend = ({ data, onToggle,hiddenTopics }: TopRadarLegendProps) => {
  return (
    <CustomChartLegend legendName='Topic Distribution'>
      <SimpleGrid cols={3} spacing='xs'>
        {data.distribution.map((item) => {
          const topicName = item.name;
          return (
            <Group
              gap='xs'
              wrap='nowrap'
              onClick={() => onToggle(item.name)}
              style={{ cursor: 'pointer' }}
            >
              <ColorSwatch color={topicColors.get(item.name)} size={12} />
              <Stack gap={0}>
                <Text
                  size='sm'
                  fw={500}
                  c={hiddenTopics.has(item.name) ? 'dimmed' : undefined}
                  td={hiddenTopics.has(item.name) ? 'line-through' : undefined}
                >
                  {topicName.charAt(0).toUpperCase() + topicName.slice(1)} (
                  {item.count})
                </Text>
              </Stack>
            </Group>
          );
        })}
      </SimpleGrid>
    </CustomChartLegend>
  );
};


export default TopRadarLegend;