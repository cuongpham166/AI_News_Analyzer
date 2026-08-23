import DashboardCard from '@/components/generic/DashboardCard';
import { useState } from 'react';
import { Group, SegmentedControl, Stack, Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import SentimentArticleItem from '@/components/MediaBias/ImpactNewsList/components/SentimentArticleItem.tsx';
import type { ImpactArticle } from '@/shared/types/analysis/media_bias/ImpactArticles.ts';
import EmptyDataCard from '@/components/generic/EmptyDataCard';
import { useImpactArticles } from '@/hooks/queries/analysis.query.ts';

interface Props {
  impactArticles?: ImpactArticle[];
}
const ImpactNewsList = ({ impactArticles }:Props) => {
  const [selectedType, setSelectedType] = useState<string>('positive');

  const { data: specificData, isFetching: isSpecificFetching } =
    useImpactArticles({ isPositive: selectedType==="positive", topN: 10 });

  const listData: ImpactArticle[] = specificData ?? impactArticles;

  const hasData = listData && listData.length > 0;
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
              { label: 'Positive Signals', value: 'positive' },
              { label: 'Negative Signals', value: 'negative' },
            ]}
          />
        </Group>
      }
      children={
        <Stack>
          {hasData ? (
            <>
              {listData.map((article) => (
                <SentimentArticleItem
                  key={`${article.source}-${article.link}`}
                  article={article}
                  onClick={() => {}}
                />
              ))}
            </>
          ) : (
            <EmptyDataCard
              title='No data available'
              description='No impact articles were found for this selection.'
            />
          )}
        </Stack>
      }
    />
  );
};

export default ImpactNewsList;
