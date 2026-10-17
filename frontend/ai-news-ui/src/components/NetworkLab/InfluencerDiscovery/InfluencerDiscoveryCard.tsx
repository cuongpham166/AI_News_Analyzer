import { SegmentedControl } from '@mantine/core';
import InfluencerDiscoveryChart from './components/InfluencerDiscoveryChart.tsx';
import TopInfluencersBarRanking from './components/TopInfluencersBarRanking.tsx';
import DashboardCard from '@/components/generic/DashboardCard';
import { useState } from 'react';
import type { InfluencerNetworkType } from '@/shared/interfaces/analysis/EntityNetworkLab/InfluencerNetworkType.ts';

interface Props {
  influencerNetwork?: InfluencerNetworkType[];
}
const InfluencerDiscoveryCard = ({ influencerNetwork }:Props) => {
  const [view, setView] = useState<'network' | 'ranking'>('network');

  return (
    <DashboardCard
      title='Influencer Network & Rankings'
      description='Explore relationships between influencers through shared article coverage, highlighting key connections and the most prominent voices.'
      toolbar={
        <SegmentedControl
          value={view}
          onChange={(val) => setView(val as 'network' | 'ranking')}
          data={[
            { label: 'Network', value: 'network' },
            { label: 'Top Influencers', value: 'ranking' },
          ]}
        />
      }
      children={
        view === 'network' ? (
          <InfluencerDiscoveryChart influencerNetwork={influencerNetwork}/>
        ) : (
          <TopInfluencersBarRanking influencerNetwork={influencerNetwork} />
        )
      }
    />
  );
};

export default InfluencerDiscoveryCard;