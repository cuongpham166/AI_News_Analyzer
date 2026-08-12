import { Box, Grid, SegmentedControl, Title } from '@mantine/core';
import MetricCard from '@/components/generic/MetricCard';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import DashboardCard from '@/components/generic/DashboardCard';
import { useState } from 'react';
import OrganizationCoverage from '@/components/NetworkLab/OrganizationConnections/components/OrganizationCoverage';
import OrganizationSentiment from '@/components/NetworkLab/OrganizationConnections/components/OrganizationSentiment';
import OrganizationNetwork from '@/components/NetworkLab/OrganizationConnections/components/OrganizationNetwork';
import AllianceNetworkData from '@/shared/test_data/AllianceNetworkData.ts';


function OrganizationConnections() {
  const [view, setView] = useState<'coverage' | 'sentiment' | 'network'>(
    'coverage',
  );

  const loadView = () => {
    switch (view) {
      case 'coverage':
        return <OrganizationCoverage data={AllianceNetworkData.data} />;
      case 'sentiment':
        return <OrganizationSentiment data={AllianceNetworkData.data} />;
      case 'network':
        return <OrganizationNetwork data={AllianceNetworkData.data} />;
      default:
        return <></>;
    }
  };
  return (
    <DashboardCard
      title='Organization Connections'
      description='Explore relationships between organizations through shared coverage and sentiment.'
      toolbar={
        <SegmentedControl
          value={view}
          onChange={(value) => setView(value)}
          data={[
            { label: 'Coverage', value: 'coverage' },
            { label: 'Sentiment', value: 'sentiment' },
            { label: 'Network', value: 'network' },
          ]}
        />
      }
      children={loadView()}
    />
  );
}

export default OrganizationConnections;