import DashboardCard from '@/components/generic/DashboardCard';
import { Group, Select, Text } from '@mantine/core';
import TrendingKeywordClustersChart from '@/components/MediaBias/TrendingKeywordClusters/TrendingKeywordClustersChart';
import { NEWS_TOPICS } from '@/shared/constants/NewsTopics.ts';
import { useMemo, useState } from 'react';
import type { TrendingKeywords } from '@/shared/types/analysis/media_bias/TrendingKeywords.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

interface Props {
  trendingKeyword?: TrendingKeywords[];
}
const TrendingKeywordClusters = ({ trendingKeyword }:Props) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All');

  const selectOptions = useMemo(
    () => [
      { label: 'All', value: 'All' },
      ...NEWS_TOPICS.map((topic) => ({
        label: topic.charAt(0).toUpperCase() + topic.slice(1),
        value: topic,
      })),
    ],
    [],
  );

  const trendingKeywordData = useMemo(() => {
    if (!trendingKeyword) {
      return [];
    }

    if (selectedTopic === 'All') {
      return trendingKeyword;
    }

    return trendingKeyword.filter((item) => item.topic === selectedTopic);
  }, [trendingKeyword, selectedTopic]);


  return (
    <DashboardCard
      title='Trending Keywords'
      description='Key phrases most frequently associated with each topic, ranked by co-occurrence.'
      headerActions={
        <Group gap='xs'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            View by:
          </Text>
          <Select
            placeholder='Select topic'
            data={selectOptions}
            onChange={(value) => {
              if (value) {
                setSelectedTopic(value);
              }
            }}
            value={selectedTopic}
          />
        </Group>
      }
      children={
        <TrendingKeywordClustersChart trendingKeyword={trendingKeywordData}/>
      }
    />
  );
};

export default TrendingKeywordClusters