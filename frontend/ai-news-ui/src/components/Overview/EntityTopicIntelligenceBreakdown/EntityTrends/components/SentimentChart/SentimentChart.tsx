
{
  /*
  TODO: Tooltip: Average sentiment is calculated from the sentiment scores of all news articles mentioning the entity. It reflects the tone of the articles, not sentiment toward the entity itself.
*/
}

import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Text, Stack, Title } from '@mantine/core';
const SentimentChart = () => {
  return (
    <Stack gap='xs'>
      <Title order={6} mb='xs' c={ThemeColors.primary}>
        Average Article Sentiment by Entity
      </Title>
      <Text c='dimmed'>
        Average sentiment of articles mentioning each entity, weighted by the
        number of mentions.
      </Text>
    </Stack>
  );
};

export default SentimentChart;