import DashboardCard from '@/components/generic/DashboardCard';
import { Select } from '@mantine/core';
import TrendingKeywordsData from '@/shared/test_data/TrendingKeywordsData.ts';
import TrendingKeywordClustersChart from '@/components/MediaBias/TrendingKeywordClusters/TrendingKeywordClustersChart';
const TrendingKeywordClusters = () =>{
  return (
    <DashboardCard
      title='Trending Keywords'
      description='Key phrases most frequently associated with each topic, ranked by co-occurrence.'
      headerActions={
        <Select
          placeholder='Select topic'
          data={['React', 'Angular', 'Vue', 'Svelte']}
        />
      }
      children={<TrendingKeywordClustersChart data={TrendingKeywordsData.data}/>}
    />
  );
}

export default TrendingKeywordClusters