import React from 'react';
import {
  Paper,
  Text,
  Box,
  Stack,
  Group,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { InfoIcon } from '@phosphor-icons/react';

interface CenteredKpiCardProps {
  title: string;
  children: React.ReactNode;
  tooltip?:string;
}
const CenteredKpiCard = ({
  title,
  children,
  tooltip,
}: CenteredKpiCardProps) => {
  return (
    <Paper radius='md' withBorder style={{ overflow: 'hidden' }}>
      <Box
        px='md'
        py='sm'
        style={{
          borderBottom: '1px solid var(--mantine-color-default-border)',
        }}
      >
        <Group justify='space-between'>
          <Text fw={600} size='xs' c='dimmed' tt='uppercase'>
            {title}
          </Text>

          {tooltip && (
            <Tooltip label={tooltip} multiline w={260} withArrow>
              <ActionIcon variant='subtle' size='sm' color='gray'>
                <InfoIcon size={14} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Box>

      <Box p='sm'>{children}</Box>
    </Paper>
  );
};

export default CenteredKpiCard