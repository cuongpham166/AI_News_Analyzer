import {
  ColorSwatch,
  Group,
  SimpleGrid, Stack, Text,
} from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import type { TopicRadarType } from '@/shared/interfaces/analysis/ExecutiveOverview/TopicRadarType.ts';

interface TopRadarLegendProps {
  data: TopicRadarType;
  onToggle: (topic: string) => void;
  hiddenTopics:Set<string>;
}
import {
  NEWS_TOPIC_COLORS,
} from '@/shared/constants/NewsTopics.ts';

const TopRadarLegend = ({ data, onToggle,hiddenTopics }: TopRadarLegendProps) => {
  return (
    <CustomChartLegend legendName='Topic'>
      <Group gap='md' wrap='wrap'>
        {data.distribution.map((item) => {
          const topicName = item.name;
          return (
            <Group
              gap={6}
              wrap='nowrap'
              onClick={() => onToggle(item.name)}
              style={{ cursor: 'pointer' }}
            >
              <ColorSwatch color={NEWS_TOPIC_COLORS[topicName]} size={10} />
              <Text
                size='sm'
                c={hiddenTopics.has(item.name) ? 'dimmed' : undefined}
                td={hiddenTopics.has(item.name) ? 'line-through' : undefined}
                >
                  {topicName.charAt(0).toUpperCase() + topicName.slice(1)}
              </Text>
            </Group>
          );
        })}
      </Group>
    </CustomChartLegend>
  );
};


export default TopRadarLegend;