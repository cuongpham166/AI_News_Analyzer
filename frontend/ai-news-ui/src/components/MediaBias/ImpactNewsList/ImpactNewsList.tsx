import DashboardCard from '@/components/generic/DashboardCard';
import { useState } from 'react';
import { Group, SegmentedControl, Stack, Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import SentimentArticleItem from '@/components/MediaBias/ImpactNewsList/components/SentimentArticleItem.tsx';
import ImpactArticlesData from '@/shared/test_data/ImpactArticlesData.ts';
const ImpactNewsList = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const articles = ImpactArticlesData.data;
  return (
    <DashboardCard
      title='Sentiment Signals'
      description='Review articles with the strongest positive and negative sentiment and identify the stories shaping the current media narrative.'
      headerActions={
        <Group gap='sm'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            Group:
          </Text>
          <SegmentedControl
            value={selectedType}
            onChange={(val) => setSelectedType(val)}
            data={[
              { label: 'All', value: 'all' },
              { label: 'Positive Signals', value: 'positive' },
              { label: 'Negative Signals', value: 'negative' },
            ]}
          />
        </Group>
      }
      children={
        <Stack>
          {articles.map((article) => (
            <SentimentArticleItem
              key={`${article.source}-${article.link}`}
              article={article}
              onClick={()=>{}}
            />
          ))}
        </Stack>
      }
    />
  );
};

export default ImpactNewsList;
