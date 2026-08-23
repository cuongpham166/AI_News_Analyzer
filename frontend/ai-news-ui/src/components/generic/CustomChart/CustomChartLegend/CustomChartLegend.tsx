import React, { type ReactNode } from 'react';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Stack, Text, Box } from '@mantine/core';

type Props = {
  children: ReactNode;
  legendName:string
};

const CustomChartLegend = ({ children, legendName }: Props) => {
  return (
    <Stack gap={6}>


      {children}
    </Stack>
  );
};

export default CustomChartLegend;
