import {
  ColorSwatch,
  Group,
  Tooltip,
  SimpleGrid,
  Stack,
  Text,
  ActionIcon,
} from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { InfoIcon } from '@phosphor-icons/react';
import LegendItem from '@/components/generic/CustomChart/CustomChartLegend/LegendItem.tsx';
const SignificantTermsInsightLegend = () => {
  const items = [
    {
      color: '#2196F3',
      title: 'Emerging Terms',
      description: 'High significance • Low mentions',
      tooltip:
        'Less frequently mentioned terms that are highly significant compared with the background dataset. These may represent emerging topics or early signals.',
    },
    {
      color: '#4CAF50',
      title: 'Trending Terms',
      description: 'High significance • High mentions',
      tooltip:
        'Frequently mentioned terms that are also highly significant compared with the background dataset. These represent the strongest and most distinctive topics in the current results.',
    },
    {
      color: '#FFC107',
      title: 'Common Terms',
      description: 'Low significance • High mentions',
      tooltip:
        'Frequently mentioned terms with relatively low statistical significance. They are common in the current results but are not especially distinctive compared with the background dataset.',
    },
    {
      color: '#9E9E9E',
      title: 'Niche Terms',
      description: 'Low significance • Low mentions',
      tooltip:
        'Terms with relatively few mentions and low statistical significance. These are currently limited in both prominence and distinctiveness.',
    },
  ];

  return (
    <CustomChartLegend legendName='Quadrant Guide (Median Split)'>
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

export default SignificantTermsInsightLegend;
