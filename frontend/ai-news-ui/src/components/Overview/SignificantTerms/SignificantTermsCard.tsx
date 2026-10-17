import React, { type ReactNode, useState } from 'react';
import {SegmentedControl } from '@mantine/core';
import SignificantTermsRank  from './components/SignificantTermsRank';
import SignificantTermsInsight from './components/SignificantTermsInsight';
import SignificantTermsDistribution from './components/SignificantTermsDistribution';
import DashboardCard from '@/components/generic/DashboardCard';
import type { SignificantTerms } from '@/shared/types/analysis';

interface Props {
  data?: SignificantTerms[];
}
function SignificantTermsCard({ data }:Props) {
  const [view, setView] = useState<'distribution' | 'ranking' | 'insights'>(
    'distribution',
  );

  const loadView = (viewName: string): ReactNode => {
    switch (viewName) {
      case 'ranking':
        return <SignificantTermsRank data={data} />;
      case 'insights':
        return <SignificantTermsInsight data={data} />;
      default:
        return <SignificantTermsDistribution data={data} />;
    }
  };
  return (
    <>
      <DashboardCard
        title='Significant Terms'
        description='Terms that stand out by statistical significance in the selected dataset.'
        toolbar={
          <SegmentedControl
            value={view}
            onChange={(val) =>
              setView(val as 'distribution' | 'ranking' | 'insights')
            }
            data={[
              { label: 'Distribution', value: 'distribution' },
              { label: 'Ranking', value: 'ranking' },
              { label: 'Insights ', value: 'insights' },
            ]}
          />
        }
        children={loadView(view)}
      />
    </>
  );
}

export default SignificantTermsCard;