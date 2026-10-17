import {SegmentedControl } from '@mantine/core';
import TopicRadarChart from '@/components/Overview/TopicRadar/components/TopicRadarChart';
import TopicRankingChart
  from '@/components/Overview/TopicRadar/components/TopicRankingChart';
import TopicRadialChart
  from '@/components/Overview/TopicRadar/components/TopicRadialChart';
import React, { useState } from 'react';
import DashboardCard from '@/components/generic/DashboardCard';
import type { TopicRadar } from '@/shared/types/analysis';

interface Props {
  data?: TopicRadar;
}
function TopicRadarCard({data}:Props) {
  const [view, setView] = useState<'ranking' | 'radial' | 'share '>('ranking');

  const loadView = () => {
    if (view === 'ranking') {
      return <TopicRankingChart data={data} />;
    }else if(view === 'radial') {
      return <TopicRadialChart data={data} />;
    }
    else{
      return <TopicRadarChart data={data} />;
    }
  }
  return (
    <DashboardCard
      title='Topic Radar'
      description='Distribution of articles across monitored topics.'
      toolbar={
        <SegmentedControl
          value={view}
          onChange={(val) => setView(val as 'ranking' | 'radial' | 'share ')}
          data={[
            { label: 'Ranking', value: 'ranking' },
            { label: 'Radial', value: 'radial' },
            { label: 'Share', value: 'share' },
          ]}
        />
      }
      children={loadView()}
    />
  );
}

export default TopicRadarCard;
