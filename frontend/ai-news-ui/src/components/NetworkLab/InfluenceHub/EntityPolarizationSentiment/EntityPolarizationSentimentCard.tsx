import {
  Box,
  Title,
  SegmentedControl,
  Stack,
  Text,
  Group,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import MetricCard from '@/components/generic/MetricCard';

import EntityPolarizationSentimentData from '@/shared/test_data/EntityPolarizationSentimentData.ts';
import type { EntityPolarizationType } from '@/shared/interfaces/analysis/EntityNetworkLab/EntityPolarizationType.ts';

import EntityPolarizationScatter
  from '@/components/NetworkLab/InfluenceHub/EntityPolarizationSentiment/EntityPolarizationScatter';

import EntityPolarizationTable
  from '@/components/NetworkLab/InfluenceHub/EntityPolarizationSentiment/EntityPolarizationTable';
import { useMemo, useState } from 'react';
function EntityPolarizationSentimentCard() {
  const data:EntityPolarizationType[] = EntityPolarizationSentimentData.data
  const [view, setView] = useState<'scatter' | 'table'>('scatter');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  const filteredData = useMemo(() => {
    if (selectedGroup === 'All') return data;
    return data.filter((item) => item.entityGroup === selectedGroup);
  }, [data, selectedGroup]);

  return (
    <MetricCard>
      <Stack gap='md'>
        <Stack gap='md'>
          <Title order={5} mb='xs' c={ThemeColors.primary}>
            Entity Polarization & Sentiment Analysis
          </Title>
          <Group gap='sm'>
            <Text size='sm' c={ThemeColors.primary} fw={500}>
              Group:
            </Text>
            <SegmentedControl
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
          <SegmentedControl
            value={view}
            onChange={(val) => setView(val as 'scatter' | 'table')}
            data={[
              { label: 'Scatter Plot', value: 'scatter' },
              { label: 'Table View', value: 'table' },
            ]}
          />
        </Stack>

        <Box style={{ flex: 1, minHeight: 0 }}>
          {view === 'scatter' ? (
            <EntityPolarizationScatter data={filteredData} />
          ) : (
            <EntityPolarizationTable data={filteredData} />
          )}
        </Box>
      </Stack>
    </MetricCard>
  );
}

export default EntityPolarizationSentimentCard;
