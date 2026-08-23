import {SegmentedControl} from '@mantine/core';
import DashboardCard from '@/components/generic/DashboardCard';
import { useState } from 'react';
import OrganizationCoverage from '@/components/NetworkLab/OrganizationConnections/components/OrganizationCoverage';
import OrganizationSentiment from '@/components/NetworkLab/OrganizationConnections/components/OrganizationSentiment';
import OrganizationNetwork from '@/components/NetworkLab/OrganizationConnections/components/OrganizationNetwork';
import type { AllianceNetwork } from '@/shared/types/analysis/network_lab/AllianceNetwork.ts';

interface Props {
  allianceNetwork?: AllianceNetwork[];
}
function OrganizationConnections({ allianceNetwork }:Props) {
  const [view, setView] = useState<'coverage' | 'sentiment' | 'network'>(
    'coverage',
  );

  const loadView = () => {
    switch (view) {
      case 'coverage':
        return (
          <OrganizationCoverage allianceNetwork={allianceNetwork}/>
        );
      case 'sentiment':
        return (
          <OrganizationSentiment allianceNetwork={allianceNetwork} />
        );
      case 'network':
        return (
          <OrganizationNetwork allianceNetwork={allianceNetwork}/>
        );
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