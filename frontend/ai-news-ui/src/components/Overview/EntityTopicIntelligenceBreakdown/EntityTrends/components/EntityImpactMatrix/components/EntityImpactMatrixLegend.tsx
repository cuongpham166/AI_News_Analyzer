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
const EntityImpactMatrixLegend = () => {
  return (
    <CustomChartLegend legendName='Quadrant Guide'>
      <SimpleGrid cols={4} spacing='xs'>
        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#d3f9d8' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Positive Spotlight
              </Text>
              <Tooltip
                label='Frequently mentioned entities appearing in articles with a consistently positive tone. These are the most prominent positive stories.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              High coverage • High sentiment
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#d0ebff' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Positive Signals
              </Text>
              <Tooltip
                label='Less frequently mentioned entities that appear in positive news. They may represent emerging topics worth monitoring.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              Low coverage • High sentiment
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#ffe3e3' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Negative Spotlight
              </Text>
              <Tooltip
                label='Highly discussed entities appearing in articles with a relatively negative tone. These represent major stories receiving significant attention.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              High coverage • Low sentiment
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#f1f3f5' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Watch List
              </Text>
              <Tooltip
                label='Less frequently mentioned entities that also appear in less positive news. They may be niche or developing stories to monitor.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              Low coverage • Low sentiment
            </Text>
          </Stack>
        </Group>
      </SimpleGrid>
    </CustomChartLegend>
  );
};

export default EntityImpactMatrixLegend;
