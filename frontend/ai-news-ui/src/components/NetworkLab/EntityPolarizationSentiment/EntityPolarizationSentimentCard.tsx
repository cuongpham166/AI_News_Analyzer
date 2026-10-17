import {
  SegmentedControl,
  Text,
  Group,
  Select,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';


import EntityPolarizationScatter from './components/EntityPolarizationScatter';
import EntityPolarizationTable from './components//EntityPolarizationTable';

import { useMemo, useState } from 'react';

import DashboardCard from '@/components/generic/DashboardCard';
import type { EntityPolarizationSentiment } from '@/shared/types/analysis';

interface Props {
  entityPolarization?: EntityPolarizationSentiment[];
}
function EntityPolarizationSentimentCard({ entityPolarization }: Props) {
  const [view, setView] = useState<'scatter' | 'table'>('scatter');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  const hasData = entityPolarization && entityPolarization.length > 0;

  const filteredData = useMemo(() => {
    if (!hasData) {
      return undefined;
    }else{
      if (selectedGroup === 'All') return entityPolarization;
      return entityPolarization.filter(
        (item) => item.entityGroup === selectedGroup,
      );
    }
  }, [entityPolarization, hasData, selectedGroup]);

  return (
    <>
      <DashboardCard
        title='Entity Sentiment vs. Polarization'
        description='Explore how entities differ in average sentiment and polarization, highlighting notable patterns and highly polarized coverage.'
        headerActions={
          <Group gap='sm'>
            <Text size='sm' c={ThemeColors.primary} fw={500}>
              View by:
            </Text>
            <Select
              value={selectedGroup}
              onChange={(val) => setSelectedGroup(val)}
              data={[
                { label: 'All', value: 'All' },
                { label: 'Person', value: 'Person' },
                { label: 'Organization', value: 'Organization' },
                { label: 'Location', value: 'Location' },
              ]}
            />
          </Group>
        }
        toolbar={
          <SegmentedControl
            value={view}
            onChange={(val) => setView(val as 'scatter' | 'table')}
            data={[
              { label: 'Scatter', value: 'scatter' },
              { label: 'Table', value: 'table' },
            ]}
          />
        }
        children={
          view === 'scatter' ? (
            <EntityPolarizationScatter data={filteredData} />
          ) : (
            <EntityPolarizationTable
              entityPolarization={entityPolarization}
            />
          )
        }
      />
    </>
  );
}

export default EntityPolarizationSentimentCard;
