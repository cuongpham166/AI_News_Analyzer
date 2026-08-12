import React, { type ReactNode } from 'react';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Stack, Text, Box } from '@mantine/core';

type Props = {
  children: ReactNode;
  legendName:string
};

const CustomChartLegend = ({
  children,
  legendName,
}: CustomChartLegendProps) => {
  return (
    <Stack gap='sm'>
      <Text size='xs' fw={700} tt='uppercase' c={ThemeColors.textSecondary}>
        {legendName}
      </Text>

      {children}
    </Stack>
  );
};

export default CustomChartLegend;
