
import React, { type ReactNode } from 'react';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { Paper } from '@mantine/core';

type Props = {
  children: ReactNode;
};

const MetricCard: React.FC<Props> = ({ children }) => {
  return (
    <Paper
      p='md'
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 400,
        background: ThemeColors.third,
      }}
    >
      {children}
    </Paper>
  );
};

export default MetricCard;
