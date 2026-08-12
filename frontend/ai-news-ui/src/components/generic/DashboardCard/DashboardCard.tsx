import { Paper, Stack, Group, Title, Box, Text, Divider } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import React, { type ReactNode } from 'react';
interface DashboardCardProps {
  title: ReactNode;
  description?: ReactNode;
  headerActions?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

function DashboardCard({
  title,
  description,
  headerActions,
  toolbar,
  footer,
  children,
}: DashboardCardProps) {
  return (
    <Paper
      p='lg'
      radius='lg'
      withBorder
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 400,
        background: ThemeColors.third,
        borderColor: ThemeColors.border,
        transition: 'box-shadow 150ms ease',
      }}
    >
      <Stack h='100%' gap='lg'>
        <Group justify='space-between' align='flex-start' wrap='nowrap'>
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Title order={4} fw={600} c={ThemeColors.text}>
              {title}
            </Title>

            {description && (
              <Text size='sm' c={ThemeColors.textSecondary}>
                {description}
              </Text>
            )}
          </Stack>

          {headerActions && (
            <Box style={{ flexShrink: 0 }}>{headerActions}</Box>
          )}
        </Group>

        {toolbar && (
          <Box
            p='sm'
            style={{
              background: ThemeColors.secondary,
              borderRadius: 8,
              border: `1px solid ${ThemeColors.border}`,
            }}
          >
            {toolbar}
          </Box>
        )}

        <Box
          style={{
            flex: 1,
            minHeight: 0,
          }}
        >
          {children}
        </Box>

        {footer && (
          <>
            <Divider color={ThemeColors.border} />

            <Box>{footer}</Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}


export default DashboardCard;