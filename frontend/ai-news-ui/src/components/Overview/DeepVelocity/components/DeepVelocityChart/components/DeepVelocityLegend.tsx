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
const DeepVelocityLegend = () => {
  return (
    <CustomChartLegend legendName='Quadrant Guide'>
      <SimpleGrid cols={4} spacing='xs'>
        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#ffc0cb' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Breakout Leaders
              </Text>
              <Tooltip
                label='Entities experiencing both high coverage and rapid growth. These represent the strongest breakout stories.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              High coverage • High velocity
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#add8e6' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Emerging Signals
              </Text>
              <Tooltip
                label='Topics that are beginning to gain momentum. Early detection may reveal important emerging trends before they become mainstream.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              Low coverage • High velocity
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#fff8b3' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Established Coverage
              </Text>
              <Tooltip
                label='Well-established topics receiving sustained coverage but showing limited recent acceleration.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              High coverage • Low velocity
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#90ee90' size={12} />
          <Stack gap={0}>
            <Group gap='xs'>
              <Text size='sm' fw={500}>
                Low Attention
              </Text>
              <Tooltip
                label='Entities with limited visibility and little recent momentum. Typically lower-priority signals.'
                multiline
                w={260}
              >
                <ActionIcon variant='subtle' size='xs' color='gray'>
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Text size='xs' c='dimmed'>
              Low coverage • Low velocity
            </Text>
          </Stack>
        </Group>
      </SimpleGrid>
    </CustomChartLegend>
  );
};

export default DeepVelocityLegend;
