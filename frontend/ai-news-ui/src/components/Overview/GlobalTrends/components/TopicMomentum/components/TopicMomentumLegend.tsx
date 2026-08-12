import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { ColorSwatch, Group, SimpleGrid, Text, Stack } from '@mantine/core';
import {NEWS_TOPIC_COLORS, NEWS_TOPICS} from '@/shared/constants/NewsTopics.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
const TopicMomentumLegend = () => {
  return (
    <CustomChartLegend legendName='Topics'>
      <Group gap='md' wrap='wrap'>
        {NEWS_TOPICS.map((item) => (
          <Group key={item} gap={6} wrap='nowrap'>
            <ColorSwatch color={NEWS_TOPIC_COLORS[item]} size={10} />

            <Text size='sm' c={ThemeColors.text}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Group>
        ))}
      </Group>
    </CustomChartLegend>
  );
};


export default TopicMomentumLegend;