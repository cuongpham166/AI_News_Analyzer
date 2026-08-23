import DashboardCard from '@/components/generic/DashboardCard';
import SourceCoverageSentimentChart from './components/SourceCoverageSentimentChart';
import type { SourceCoverage } from '@/shared/types/analysis/media_bias/SourceCoverage.ts';

interface Props {
  sourceCoverage?: SourceCoverage[];
}
const SourceCoverageSentiment = ({ sourceCoverage }:Props) => {
  return (
    <DashboardCard
      title='Source Coverage & Sentiment'
      description='Explore article volume by topic and source, with sentiment details available on hover.'
      children={
        <SourceCoverageSentimentChart sourceCoverage={sourceCoverage}/>
      }
    />
  );
};

export default SourceCoverageSentiment;
