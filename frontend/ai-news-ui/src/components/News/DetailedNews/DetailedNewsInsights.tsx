import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import { Paper, Stack, Title, Divider } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import SentimentSection from '@/components/News/DetailedNews/components/SentimentSection.tsx';
import TopicSection from '@/components/News/DetailedNews/components/TopicSection.tsx';
import KeyphrasesSection from '@/components/News/DetailedNews/components/KeyphrasesSection.tsx';
import EntitiesSection from '@/components/News/DetailedNews/components/EntitiesSection.tsx';

interface DetailedNewsInsightsProps {
  article: DetailedNews;
}

const DetailedNewsInsights = ({ article }: DetailedNewsInsightsProps) => {
  const { sentiment, topic, keyphrases, entities } = article.inference;

  return (
    <Paper
      p='lg'
      radius='lg'
      withBorder
      style={{
        background: ThemeColors.third,
        borderColor: ThemeColors.border,
      }}
    >
      <Stack gap='xl'>
        <Title order={3} size='h4'>
          Article insights
        </Title>
        <SentimentSection sentiment={sentiment} />
        <Divider color={ThemeColors.border} />
        <TopicSection topic={topic} />
        {keyphrases.length > 0 && (
          <>
            <Divider color={ThemeColors.border} />
            <KeyphrasesSection keyphrases={keyphrases} />
          </>
        )}
        {entities.length > 0 && (
          <>
            <Divider color={ThemeColors.border} />
            <EntitiesSection entities={entities} />
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default DetailedNewsInsights