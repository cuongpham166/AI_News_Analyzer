import DashboardCard from '@/components/generic/DashboardCard';
import { SegmentedControl } from '@mantine/core';
import React, { useState } from 'react';
import DuplicationChart from '@/components/MediaBias/ContentDuplication/components/DuplicationChart';
import NarrativeSpreadChart from '@/components/MediaBias/ContentDuplication/components/NarrativeSpreadChart';
import type { EchoChamber } from '@/shared/types/analysis/media_bias/EchoChamber.ts';

interface Props {
  echoChamber?: EchoChamber[];
}
const ContentDuplication = ({ echoChamber }:Props) => {
  const [view, setView] = useState<'duplication' | 'narrative'>('duplication');
  return (
    <DashboardCard
      title='Content Duplication & Narrative Spread'
      description='Identify repeated stories and see how content propagates across publishers.'
      toolbar={
        <SegmentedControl
          value={view}
          onChange={(val) => setView(val as 'duplication' | 'narrative')}
          data={[
            { label: 'Duplication', value: 'duplication' },
            { label: 'Narrative Spread', value: 'narrative' },
          ]}
        />
      }
      children={
        view === 'narrative' ? (
          <NarrativeSpreadChart echoChamber={echoChamber}/>
        ) : (
          <DuplicationChart echoChamber={echoChamber} />
        )
      }
    />
  );
};

export default ContentDuplication