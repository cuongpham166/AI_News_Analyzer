import React, { ReactNode } from 'react';
import { Box, Group, Stack, Text, Title,Paper } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
interface DashboardSectionProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

function DashboardSection({
  title,
  description,
  actions,
  children,
}: DashboardSectionProps) {
  return (
    <Stack gap='md' h='100%'>
      <Group justify='space-between' align='flex-start' wrap='nowrap'>
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Title order={6} fw={600} c={ThemeColors.text}>
            {title}
          </Title>

          {description && (
            <Text size='xs' c={ThemeColors.textSecondary}>
              {description}
            </Text>
          )}
        </Stack>

        {actions && <Box style={{ flexShrink: 0 }}>{actions}</Box>}
      </Group>

      {children}
    </Stack>
  );
}

export default DashboardSection;