import React, { type ReactNode, useState } from 'react';
import Searchbar from '../Searchbar';
import { Button, Group, NativeSelect, NumberInput, Stack, Title, Box, Select, Text } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors';
import { ArrowRightIcon, CaretDownIcon } from '@phosphor-icons/react';
import { useDashboardIntervalStore } from '@/stores/dashboard.store.ts';
import type { Interval } from '@/shared/types/DashboardInterval.ts';
type Props = {
  taskbarTitle: string;
};

const Taskbar: React.FC<Props> = ({ taskbarTitle }) => {
  const interval = useDashboardIntervalStore((state) => state.interval);

  const updateInterval = useDashboardIntervalStore(
    (state) => state.updateInterval,
  );

  const applyInterval = useDashboardIntervalStore(
    (state) => state.applyInterval,
  );

  const onChangeNumberInterval = (value: number | string) => {
    updateInterval({
      amount: Number(value),
    });
  };

  const onChangeTypeInterval = (value: Interval['intervalUnit'] | null) => {
    if (!value) return;
    updateInterval({
      intervalUnit: value,
    });
  };

  const onChangeGlobalInterval = () => {
    applyInterval();
  };

  return (
    <Box>
      <Group justify='space-between' align='flex-start' wrap='wrap' gap='lg'>
        <Stack gap={2}>
          <Title order={2} fw={700} c={ThemeColors.text}>
            {taskbarTitle}
          </Title>

          <Text size='sm' c={ThemeColors.textSecondary}>
            AI-powered news intelligence and analytics
          </Text>
        </Stack>

        <Stack gap='xs' align='flex-end'>
          <Searchbar />

          <Group gap='xs' align='center'>
            <Text size='sm' fw={500} c={ThemeColors.textSecondary}>
              Analyze
            </Text>

            <NumberInput
              value={interval.amount}
              min={1}
              max={10}
              w={70}
              h={36}
              hideControls
              onChange={onChangeNumberInterval}
            />

            <Select
              value={interval.intervalUnit}
              w={110}
              data={[
                { value: 'day', label: 'Days' },
                { value: 'week', label: 'Weeks' },
                { value: 'month', label: 'Months' },
                { value: 'year', label: 'Years' },
              ]}
              onChange={(value) =>
                onChangeTypeInterval(value as Interval['intervalUnit'])
              }
            />

            <Button
              h={36}
              rightSection={<ArrowRightIcon size={14} />}
              onClick={onChangeGlobalInterval}
            >
              Apply
            </Button>
          </Group>
        </Stack>
      </Group>
    </Box>
  );
};

export default Taskbar;
