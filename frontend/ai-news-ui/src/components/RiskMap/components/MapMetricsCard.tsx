import {
  ActionIcon,
  Box,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { InfoIcon } from '@phosphor-icons/react';
import React from 'react';


interface MapMetricsCardProps {
  title:string;
  value: string | number;
  tooltip:string;
  index:number;
}
const MapMetricsCard = ({title, value, tooltip, index}: MapMetricsCardProps) => {
  const metricColors = ['blue', 'cyan', 'violet', 'orange'];
  return (
      <Paper
        key={title}
        p='md'
        radius='md'
        withBorder
        style={{
          borderLeft: `10px solid var(--mantine-color-${metricColors[index]}-6)`,
        }}
      >
        <Stack gap='xs'>
          <Group justify='space-between' align='flex-start'>
            <Text size='sm' fw={500} c='dimmed'>
              {title}
            </Text>

            {tooltip && (
              <Tooltip label={tooltip} multiline w={260} withArrow>
                <ActionIcon
                  variant='subtle'
                  size='sm'
                  color='gray'
                  aria-label={`Information about ${title}`}
                >
                  <InfoIcon size={14} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>

          <Box mih={32}>
            <Title order={2} fw={700} lh={1.1}>
              {value}
            </Title>
          </Box>
        </Stack>
      </Paper>
  );
};

export default MapMetricsCard;