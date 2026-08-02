import React, { type ReactNode } from 'react';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Paper, Text } from '@mantine/core';

type Props = {
  children: ReactNode;
  legendName:string
};

const CustomChartLegend: React.FC<Props> = ({ children, legendName }) => {
  return (
    <Paper withBorder p='sm' radius='md' mb='md'>
      <Text fw={600} size='sm' mb='xs'>
        {legendName}
      </Text>
      {children}
    </Paper>
  );
};

export default CustomChartLegend;
