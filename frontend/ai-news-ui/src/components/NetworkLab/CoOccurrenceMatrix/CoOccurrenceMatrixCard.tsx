import DashboardCard from '@/components/generic/DashboardCard';
import CoOccurrenceMatrixChart from '@/components/NetworkLab/CoOccurrenceMatrix/components/CoOccurrenceMatrixChart';
import type { CoOccurrence } from '@/shared/types/analysis/network_lab/CoOccurrence.ts';
import { Group, Select, Text } from '@mantine/core';
import { useState } from 'react';
import { ThemeColors } from '@/shared/constants/Colors.ts';

interface Props {
  coOccurrence?: CoOccurrence[];
}

const RELATIONSHIP_OPTIONS = [
  { value: 'all', label: 'All relationships' },
  { value: 'person:person', label: 'Person ↔ Person' },
  { value: 'person:organization', label: 'Person ↔ Organization' },
  { value: 'person:location', label: 'Person ↔ Location' },
  { value: 'person:event', label: 'Person ↔ Event' },
  { value: 'organization:organization', label: 'Organization ↔ Organization' },
  { value: 'organization:location', label: 'Organization ↔ Location' },
  { value: 'organization:event', label: 'Organization ↔ Event' },
  { value: 'location:location', label: 'Location ↔ Location' },
  { value: 'location:event', label: 'Location ↔ Event' },
  { value: 'event:event', label: 'Event ↔ Event' },
];

const TOP_N_OPTIONS = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];

const CoOccurrenceMatrixCard = ({ coOccurrence }: Props) => {
  const [relationshipType, setRelationshipType] = useState('all');
  const [topN, setTopN] = useState('10');

  return (
    <DashboardCard
      title='Entity Co-occurrence'
      description='Explore the top entity connections by shared coverage, filtered by relationship type, with joint sentiment shown on hover.'
      toolbar={
        <Group gap='xl'>
          <Group gap='sm'>
            <Text size='sm' c={ThemeColors.primary} fw={500}>
              Relationship type:
            </Text>
            <Select
              value={relationshipType}
              onChange={(value) => setRelationshipType(value ?? 'all')}
              data={RELATIONSHIP_OPTIONS}
              w={240}
              allowDeselect={false}
            />
          </Group>

          <Group gap='sm'>
            <Text size='sm' c={ThemeColors.primary} fw={500}>
              Show:
            </Text>
            <Select
              value={topN}
              onChange={(value) => setTopN(value ?? '10')}
              data={TOP_N_OPTIONS}
              w={120}
              allowDeselect={false}
            />
          </Group>
        </Group>
      }
      children={
        <CoOccurrenceMatrixChart
          coOccurrence={coOccurrence}
          relationshipType={relationshipType}
          topN={topN}
        />
      }
    />
  );
};


export default CoOccurrenceMatrixCard;