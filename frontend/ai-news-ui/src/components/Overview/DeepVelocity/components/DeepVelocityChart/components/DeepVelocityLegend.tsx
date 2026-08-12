import {
  SimpleGrid,
} from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { InfoIcon } from '@phosphor-icons/react';
import LegendItem from '@/components/generic/CustomChart/CustomChartLegend/LegendItem.tsx';
const DeepVelocityLegend = () => {
  const items = [
    {
      color: '#add8e6',
      title: 'Emerging Signals',
      description: 'Low coverage • High velocity',
      tooltip:
        'Topics that are beginning to gain momentum. Early detection may reveal important emerging trends before they become mainstream.',
    },
    {
      color: '#ffc0cb',
      title: 'Breakout Leaders',
      description: 'High coverage • High velocity',
      tooltip:
        'Entities experiencing both high coverage and rapid growth. These represent the strongest breakout stories.',
    },
    {
      color: '#fff8b3',
      title: 'Established Coverage',
      description: 'High coverage • Low velocity',
      tooltip:
        'Well-established topics receiving sustained coverage but showing limited recent acceleration.',
    },
    {
      color: '#90ee90',
      title: 'Low Attention',
      description: 'Low coverage • Low velocity',
      tooltip:
        'Entities with limited visibility and little recent momentum. Typically lower-priority signals.',
    },
  ];

  return (
    <CustomChartLegend legendName='Quadrant Guide'>
      <SimpleGrid
        cols={{
          base: 1,
          sm: 2,
          lg: 4,
        }}
        spacing='md'
      >
        {items.map((item) => (
          <LegendItem key={item.title} {...item} />
        ))}
      </SimpleGrid>
    </CustomChartLegend>
  );
};

export default DeepVelocityLegend;
