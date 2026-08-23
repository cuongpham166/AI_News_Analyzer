import DashboardCard from '@/components/generic/DashboardCard';
import EventMomentumChart from '@/components/NetworkLab/EventMomentum/components/EventMomentumChart';
import type { EventMomentum } from '@/shared/types/analysis/network_lab/EventMomentum.ts';
import React, { useState } from 'react';
import { Group, Select, Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';

interface Props {
  eventMomentum?: EventMomentum[];
}

const TOP_N_OPTIONS = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];


const EventMomentum = ({ eventMomentum }:Props) => {
  const [limit, setLimit] = useState('10');
  return (
    <DashboardCard
      title='Event Coverage Timeline'
      description='Track news volume for key events over time to identify coverage spikes, sustained attention, and emerging trends'
      headerActions={
        <Group gap='sm'>
          <Text size='sm' c={ThemeColors.primary} fw={500}>
            Show:
          </Text>
          <Select
            value={limit}
            onChange={(value) => setLimit(value ?? '10')}
            data={TOP_N_OPTIONS}
            w={120}
            allowDeselect={false}
          />
        </Group>
      }
      children={
        <EventMomentumChart eventMomentum={eventMomentum} limit={limit} />
      }
    />
  );
};

export default EventMomentum;