import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { ColorSwatch, Group, SimpleGrid, Text } from '@mantine/core';
import {NEWS_TOPIC_COLORS, NEWS_TOPICS} from '@/shared/constants/NewsTopics.ts';
import { topicColors } from '@/shared/constants/ChartColors.ts';

const GlobalTrendsLegend = () => {
  return (
    <CustomChartLegend legendName='Topic Guide'>
      <SimpleGrid cols={4} spacing='xs'>
        {NEWS_TOPICS.map((item, i) => (
          <Group gap='xs' wrap='nowrap' style={{ cursor: 'pointer' }}>
            <ColorSwatch color={topicColors.get(item)} size={12} />
            <Text size='sm' fw={500}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Group>
        ))}
      </SimpleGrid>
    </CustomChartLegend>
  );
};


export default GlobalTrendsLegend;