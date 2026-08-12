import DashboardCard from '@/components/generic/DashboardCard';
import MediaBiasData from '@/shared/test_data/MediaBiasData.ts';
import SourceCoverageSentimentChart from './components/SourceCoverageSentimentChart';
const SourceCoverageSentiment = () => {
  return (
    <DashboardCard
      title='Source Coverage & Sentiment'
      description='Compare topic coverage across sources and the average sentiment associated with each source-topic combination.'
      children={<SourceCoverageSentimentChart data={MediaBiasData.data} />}
    />
  );
};

export default SourceCoverageSentiment;
