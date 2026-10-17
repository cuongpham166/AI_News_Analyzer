import {
  Box,
  ColorSwatch,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';
const QUADRANT_ITEMS = [
  {
    title: 'Polarized Positive',
    subtitle: 'Positive sentiment • High polarization',
    color: 'rgba(255, 192, 203, 0.7)', // Pink
  },
  {
    title: 'Polarized Negative',
    subtitle: 'Negative sentiment • High polarization',
    color: 'rgba(173, 216, 230, 0.7)', // Light Blue
  },
  {
    title: 'Consensus Positive',
    subtitle: 'Positive sentiment • Low polarization',
    color: 'rgba(144, 238, 144, 0.7)', // Light Green
  },
  {
    title: 'Consensus Negative',
    subtitle: 'Negative sentiment • Low polarization',
    color: 'rgba(255, 235, 204, 0.7)', // Light Yellow/Orange
  },
];

const ENTITY_GROUP_LABELS: Record<string, string> = {
  organization: 'Organization',
  event: 'Event',
  person: 'Person',
  location: 'Location',
};

export const EntityPolarizationLegend = () => {
  return (
    <Stack gap='md' mt='sm'>
      {/* 1. Quadrant Guide Section */}
      <CustomChartLegend legendName='Quadrant Guide'>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing='xs'>
          {QUADRANT_ITEMS.map((item) => (
            <Group key={item.title} gap='xs' wrap='nowrap'>
              <ColorSwatch color={item.color} size={14} radius='xs' />
              <Stack gap={0}>
                <Text size='sm' fw={500}>
                  {item.title}
                </Text>
                <Text size='xs' c='dimmed'>
                  {item.subtitle}
                </Text>
              </Stack>
            </Group>
          ))}
        </SimpleGrid>
      </CustomChartLegend>

      <Box px='xs'>
        <Text size='xs' fw={600} c='dimmed' tt='uppercase' mb={6}>
          Entity Categories
        </Text>
        <Group gap='lg'>
          {Object.entries(NEWS_ENTITY_COLORS)
            .filter(([key]) => key !== 'keyphrase')
            .map(([key, color]) => (
            <Group key={key} gap={6} wrap='nowrap'>
              <ColorSwatch color={color} size={10} />
              <Text size='xs' fw={500}>
                {ENTITY_GROUP_LABELS[key] || key}
              </Text>
            </Group>
          ))}
        </Group>
      </Box>
    </Stack>
  );
};


export default EntityPolarizationLegend;