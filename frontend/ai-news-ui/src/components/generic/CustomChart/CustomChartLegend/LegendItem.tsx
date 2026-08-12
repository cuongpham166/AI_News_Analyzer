import {
  ColorSwatch,
  Group,
  Tooltip,
  SimpleGrid,
  Stack,
  Text,
  ActionIcon,
} from '@mantine/core';
import { InfoIcon } from '@phosphor-icons/react';
import {ThemeColors} from '@/shared/constants/Colors.ts';

interface LegendItemProps {
  color: string;
  title: string;
  description: string;
  tooltip: string;
}

function LegendItem({ color, title, description, tooltip }: LegendItemProps) {
  return (
    <Group gap='xs' align='flex-start' wrap='nowrap'>
      <ColorSwatch color={color} size={12} mt={4} />

      <Stack gap={1}>
        <Group gap={4} wrap='nowrap'>
          <Text size='sm' fw={600} c={ThemeColors.text}>
            {title}
          </Text>

          <Tooltip label={tooltip} multiline w={260}>
            <ActionIcon variant='subtle' size='xs' color='gray'>
              <InfoIcon size={14} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Text size='xs' c={ThemeColors.textSecondary}>
          {description}
        </Text>
      </Stack>
    </Group>
  );
}

export default LegendItem;
