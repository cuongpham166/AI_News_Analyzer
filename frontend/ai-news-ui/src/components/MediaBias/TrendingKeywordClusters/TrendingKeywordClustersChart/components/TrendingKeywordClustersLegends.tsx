import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import {
  ColorSwatch,
  Group,
  SimpleGrid,
  Text,
  Stack,
  Box,
} from '@mantine/core';
import {
  NEWS_TOPIC_COLORS,
  NEWS_TOPICS,
} from '@/shared/constants/NewsTopics.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
const TrendingKeywordClustersLegends = () => {
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px 12px',
      }}
    >
      {NEWS_TOPICS.map((item) => (
        <Group key={item} gap={6} wrap='nowrap'>
          <ColorSwatch color={NEWS_TOPIC_COLORS[item]} size={10} />

          <Text size='sm' c={ThemeColors.text}>
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        </Group>
      ))}
    </Box>
  );
};

export default TrendingKeywordClustersLegends;
