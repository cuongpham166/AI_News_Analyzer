import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { ColorSwatch, Group, SimpleGrid, Text,Stack } from '@mantine/core';
import {NEWS_SENTIMENTS, NEWS_SENTIMENT_COLORS} from '@/shared/constants/NewsSentiments.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

const SentimentDistributionLegend = () => {
  return (
    <CustomChartLegend legendName='Sentiment'>
      <Group gap='md' wrap='wrap'>
        {NEWS_SENTIMENTS.map((item, index) => (
          <Group gap='xs' wrap='nowrap' style={{ cursor: 'pointer' }}>
            <ColorSwatch color={NEWS_SENTIMENT_COLORS[item]} size={12} />
            <Text size='sm' c={ThemeColors.text}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Group>
        ))}
      </Group>
    </CustomChartLegend>
  );
}


export default SentimentDistributionLegend;