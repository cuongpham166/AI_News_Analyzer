import { ColorSwatch, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import {
  VOLATILITY_COLORS,
  VOLATILITY_LEVELS,
} from '@/shared/constants/VolatilityLevel.ts';
const EventRiskLegend = () => {
  return (
    <CustomChartLegend legendName='VOLATILITY LEVELS'>
      <Group gap='md' wrap='wrap'>
        {VOLATILITY_LEVELS.map((item) => {
          return (
            <Group gap='xs' wrap='nowrap'>
              <ColorSwatch color={VOLATILITY_COLORS[item]} size={12} />
              <Text size='sm' c={ThemeColors.text}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </Group>
          );
        })}
      </Group>
    </CustomChartLegend>
  );
};


export default EventRiskLegend;