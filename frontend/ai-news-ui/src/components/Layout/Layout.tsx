import React, { type ReactNode } from 'react';
import { AppShell, Box } from '@mantine/core';
import Sidebar from './Sidebar';
import { ThemeColors } from '@/shared/constants/Colors';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: 'sm',
      }}
      padding='md'
      styles={{
        root: {
          minHeight: '100vh',
        },

        main: {
          minHeight: '100vh',
          backgroundColor: ThemeColors.primaryBackground,
        },
      }}
    >
      <AppShell.Navbar
        p='lg'
        style={{
          backgroundColor: ThemeColors.sidebar,
          border: 'none',
        }}
      >
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Box
          style={{
            width: '100%',
            minHeight: '100%',
          }}
        >
          {children}
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
