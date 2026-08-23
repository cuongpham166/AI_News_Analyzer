import {
  ColorSwatch,
  Group,
  Text,
  Box,
} from '@mantine/core';
import {
  NEWS_ENTITY_COLORS,
  NEWS_ENTITIES,
} from '@/shared/constants/NewsEntities.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

const SignificantTermsLegend = () => {
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px 12px',
      }}
    >
      {NEWS_ENTITIES.map((item) => {
        return (
          <Group key={item} gap={6} wrap='nowrap'>
            <ColorSwatch color={NEWS_ENTITY_COLORS[item]} size={10} />
            <Text size='sm' c={ThemeColors.text}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Group>
        );
      })}
    </Box>
  );
};

export default SignificantTermsLegend;
