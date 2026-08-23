import DashboardCard from '@/components/generic/DashboardCard';
import type { NarrativeBridge } from '@/shared/types/analysis/network_lab/NarrativeBridge.ts';
import NarrativeBridgeTable from '@/components/NetworkLab/NarrativeBridge/components';
import { useState } from 'react';
import { TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

interface Props {
  narrativeBridge?: NarrativeBridge[];
}
const NarrativeBridgeCard = ({ narrativeBridge }:Props) => {
  const [search, setSearch] = useState('');

  return (
    <DashboardCard
      title='Narrative Bridge'
      description='Connect key figures directly to their core narrative phrases to evaluate messaging stability, frequency, and sentiment.'
      children={
        <NarrativeBridgeTable narrativeBridge={narrativeBridge}/>
      }
      toolbar={
        <TextInput
          placeholder='Filter person or phrase...'
          size='xs'
          leftSection={<MagnifyingGlassIcon size={14} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      }
    />
  );
};

export default NarrativeBridgeCard;