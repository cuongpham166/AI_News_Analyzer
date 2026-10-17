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

export interface QuadrantLegendItem {
  id: string;
  title: string;
  description: string;
  subtitle: string;
  color: string;
}

export const QUADRANTS: QuadrantLegendItem[] = [
  {
    id: 'positive-spotlight',
    title: 'Positive Champions',
    subtitle: 'High coverage • Positive sentiment',
    color: '#D1FAE5',
    description:
      'Frequently mentioned entities appearing in articles with a consistently positive tone. These represent major positive news stories.',
  },
  {
    id: 'positive-signals',
    title: 'Emerging Signals',
    subtitle: 'Low coverage • Positive sentiment',
    color: '#E0F2FE',
    description:
      'Less frequently mentioned entities with positive news sentiment. They represent potential opportunity areas or emerging trends.',
  },
  {
    id: 'negative-spotlight',
    title: 'High Risk Spotlight',
    subtitle: 'High coverage • Negative sentiment',
    color: '#FEE2E2',
    description:
      'Highly discussed entities appearing alongside negative sentiment or high risk scores. These represent critical stories needing attention.',
  },
  {
    id: 'watch-list',
    title: 'Watch List',
    subtitle: 'Low coverage • Negative sentiment',
    color: '#F3F4F6',
    description:
      'Entities with lower coverage but leaning negative. Useful for early warning detection before stories scale in volume.',
  },
];

const EntityImpactMatrixLegend: React.FC = () => {
  return (
    <CustomChartLegend legendName='Quadrant Guide'>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing='md'>
        {QUADRANTS.map((quadrant) => (
          <Group key={quadrant.id} gap='xs' wrap='nowrap' align='flex-start'>
            <ColorSwatch
              color={quadrant.color}
              size={12}
              style={{ marginTop: 4, flexShrink: 0 }}
            />
            <Stack gap={2}>
              <Group gap={4} wrap='nowrap'>
                <Text size='sm' fw={600} c='gray.8'>
                  {quadrant.title}
                </Text>
                <Tooltip
                  label={quadrant.description}
                  multiline
                  w={260}
                  withArrow
                  position='top'
                >
                  <ActionIcon
                    variant='subtle'
                    size='xs'
                    color='gray'
                    aria-label={`Info about ${quadrant.title}`}
                  >
                    <InfoIcon size={14} />
                  </ActionIcon>
                </Tooltip>
              </Group>
              <Text size='xs' c='dimmed'>
                {quadrant.subtitle}
              </Text>
            </Stack>
          </Group>
        ))}
      </SimpleGrid>
    </CustomChartLegend>
  );
};

export default EntityImpactMatrixLegend;
