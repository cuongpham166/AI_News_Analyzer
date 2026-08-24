import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, Text, Button, NavLink } from '@mantine/core';
import {
  GaugeIcon,
  GlobeIcon,
  FileMagnifyingGlassIcon,
  SignOutIcon,
  UserIcon,
  ArticleIcon,
  NewspaperIcon,
  ShareNetworkIcon,StackIcon
} from '@phosphor-icons/react';


function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const menuData = [
    { icon: GaugeIcon, label: 'Overview', url: '/' },
    { icon: ShareNetworkIcon, label: 'Network Lab', url: '/network_lab' },
    { icon: ArticleIcon, label: 'Media Bias', url: '/media_bias' },
    { icon: GlobeIcon, label: 'Risk & Map', url: '/risk_map' },
    { icon: NewspaperIcon, label: 'News', url: '/news' },
    { icon: UserIcon, label: 'Profile' },
  ];

  return (
    <Stack
      justify='space-between'
      h='100%'
      p='xl'
      style={{
        background: '#0F172A',
      }}
    >
      <Stack gap={4} align='center'>
        <StackIcon size={50} weight='duotone' color='#FFFFFF' />
        <Text size='lg' fw={700} c='#FFFFFF'>
          Trinoetic
        </Text>
      </Stack>

      <Stack gap={6}>
        {menuData.map((item) => {
          const active = location.pathname === item.url;
          return (
            <NavLink
              key={item.label}
              label={item.label}
              leftSection={<item.icon size={22} />}
              onClick={() => navigate(item.url)}
              styles={{
                root: {
                  borderRadius: 8,
                  padding: '10px 12px',

                  backgroundColor: active ? '#1D4ED8' : 'transparent',

                  color: active ? '#FFFFFF' : '#CBD5E1',

                  '&:hover': {
                    backgroundColor: active ? '#1D4ED8' : '#1E293B',
                  },
                },

                label: {
                  fontSize: 15,
                  fontWeight: 500,
                },

                section: {
                  color: 'inherit',
                },
              }}
            />
          );
        })}
      </Stack>

      <Button
        variant='subtle'
        fullWidth
        leftSection={<SignOutIcon size={22} />}
        styles={{
          root: {
            color: '#CBD5E1',

            '&:hover': {
              backgroundColor: '#1E293B',
              color: '#CBD5E1',
            },
          },
        }}
      >
        Logout
      </Button>
    </Stack>
  );
}

export default Sidebar;
