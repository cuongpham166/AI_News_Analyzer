import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Text, Button, NavLink } from '@mantine/core';
import {
  GaugeIcon,
  GlobeIcon,
  FileMagnifyingGlassIcon,
  SignOutIcon,
  UserIcon,
  ArticleIcon,
  NewspaperIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react';
import { ThemeColors } from '@/shared/constants/Colors';

function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navigate = useNavigate();
  const menuData = [
    { icon: GaugeIcon, label: 'Overview', url: '/' },
    { icon: ShareNetworkIcon, label: 'Network Lab', url: '/network_lab' },
    { icon: ArticleIcon, label: 'Media Bias', url: '/media_bias' },
    { icon: GlobeIcon, label: 'Risk & Map', url: '/discovery' },
    { icon: NewspaperIcon, label: 'News', url: '/news' },
    { icon: UserIcon, label: 'Profile' },
  ];

  const onMenuClick = (event) => {
    const menuTitle = event.target.innerText;
    const foundItem = menuData.filter((menu) => menu.label == menuTitle);
    const url = foundItem[0]['url'];
    navigate(url);
  };

  return (
    <Stack justify='space-between' style={{ height: '100%' }}>
      <Stack gap='0' justify='center' align='center' style={{ width: '100%' }}>
        <FileMagnifyingGlassIcon
          size={50}
          color={ThemeColors.secondary}
          weight='fill'
        />
        <Text
          c={ThemeColors.secondary}
          size='xl'
          style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 700 }}
        >
          AI Analyzer
        </Text>
      </Stack>

      <Stack gap='lg'>
        {menuData.map((item, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <NavLink
              key={item.label}
              label={item.label}
              component='a'
              leftSection={
                <item.icon
                  size={26}
                  color={
                    isHovered ? ThemeColors.primary : ThemeColors.secondary
                  }
                />
              }
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(event) => onMenuClick(event)}
              styles={(theme) => ({
                label: {
                  color: isHovered
                    ? ThemeColors.primary
                    : ThemeColors.secondary,
                  fontWeight: 500,
                  fontSize: '16px',
                },

                root: {
                  padding: '0.5rem 1rem',
                  borderRadius: theme.radius.sm,
                  backgroundColor: isHovered
                    ? ThemeColors.secondary
                    : 'transparent',
                  cursor: 'pointer',
                },
              })}
            />
          );
        })}
      </Stack>
      <Button
        leftSection={<SignOutIcon size={25} />}
        variant='default'
        fullWidth
        style={{
          background: ThemeColors.secondary,
          color: ThemeColors.primary,
          border: 'none',
        }}
      >
        Logout
      </Button>
    </Stack>
  );
}

export default Sidebar;
