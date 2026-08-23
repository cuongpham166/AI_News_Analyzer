import { Box, Grid, Stack, Title, Text, SegmentedControl } from '@mantine/core';
import DashboardCard from '@/components/generic/DashboardCard';
import ConnectionNetwork from '@/components/NetworkLab/PowerCouples/components/ConnectionNetwork';
import ConnectionSentiment from '@/components/NetworkLab/PowerCouples/components/ConnectionSentiment';
import ConnectionStability from '@/components/NetworkLab/PowerCouples/components/ConnectionStability';
import { useState } from 'react';
import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';

interface Props {
  powerCouple?: PowerCouple[];
}
const PowerCouplesCard = ({ powerCouple }: Props) => {
  const [view, setView] = useState<'relationships' | 'sentiment' | 'stability'>(
    'relationships',
  );

  const loadView = () => {
    switch (view) {
      case 'relationships':
        return (
          <ConnectionNetwork powerCouple={powerCouple}/>
        );
      case 'sentiment':
        return (
          <ConnectionSentiment powerCouple={powerCouple}/>
        );
        case 'stability':
          return <ConnectionStability powerCouple={powerCouple} />;
      default:
        return <></>;
    }
  };
  return (
    <DashboardCard
      title='Power Connections'
      description='Discover the strongest person–organization relationships and examine their sentiment, stability, and strength.'
      toolbar={
        <SegmentedControl
          value={view}
          onChange={(value) => setView(value)}
          data={[
            { label: 'Relationships', value: 'relationships' },
            { label: 'Sentiment', value: 'sentiment' },
            { label: 'Stability', value: 'stability' },
          ]}
        />
      }
      children={loadView()}
    />
  );
};

export default PowerCouplesCard;
