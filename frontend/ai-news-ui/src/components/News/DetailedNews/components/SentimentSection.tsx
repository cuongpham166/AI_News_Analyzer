import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import { Stack, Text } from '@mantine/core';
import SentimentBar from './SentimentBar.tsx';

const SentimentSection = ({
  sentiment,
}: DetailedNews['inference']['sentiment']) => {
  return (
    <Stack gap='sm'>
      <Text size='sm' fw={600}>
        Sentiment
      </Text>

      <SentimentBar label={sentiment.label} score={sentiment.score} />
    </Stack>
  );
};

export default SentimentSection;