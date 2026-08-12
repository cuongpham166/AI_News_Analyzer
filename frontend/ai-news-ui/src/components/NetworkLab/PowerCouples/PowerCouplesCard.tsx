import { Box, Grid, Stack, Title, Text, SegmentedControl } from '@mantine/core';
import DashboardCard from '@/components/generic/DashboardCard';
import ConnectionNetwork from '@/components/NetworkLab/PowerCouples/components/ConnectionNetwork';
import ConnectionSentiment from '@/components/NetworkLab/PowerCouples/components/ConnectionSentiment';
import { useState } from 'react';
import PowerCoupleData from '@/shared/test_data/PowerCoupleData.ts';
const PowerCouplesCard = () => {
  const [view, setView] = useState<
    'relationships' | 'sentiment'
  >('sentiment');

  const loadView = () => {
    switch (view) {
      case 'relationships':
        return <ConnectionNetwork data={PowerCoupleData.data} />;
        case 'sentiment':
          return <ConnectionSentiment data={PowerCoupleData.data} />;
      default:
        return <></>;
    }
  }
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
          ]}
        />
      }
      children={loadView()}
    />
  );
};

export default PowerCouplesCard;
