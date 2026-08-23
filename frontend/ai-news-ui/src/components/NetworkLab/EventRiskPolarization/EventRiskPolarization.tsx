import DashboardCard from '@/components/generic/DashboardCard';
import EventRiskChart from './components/EventRiskChart';
import type { EventRisk } from '@/shared/types/analysis/network_lab/EventRisk.ts';
import { Group, Select, Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';

const TOP_N_OPTIONS = [
  { value: '5', label: 'Top 5' },
  { value: '10', label: 'Top 10' },
  { value: '20', label: 'Top 20' },
];

import React, { useState } from 'react';

interface Props {
  eventRisk?: EventRisk[];
}
const EventRiskPolarization = ({ eventRisk }:Props) => {
  const [limit, setLimit] = useState('10');
  return (
    <DashboardCard
      title='Event Coverage & Polarization'
      description='Rank events by news coverage, with sentiment and polarization signals to highlight stories that may require closer attention.'
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
        <EventRiskChart
          eventRisk={eventRisk}
          limit={limit}
        />
      }
    />
  );
};

export default EventRiskPolarization;
