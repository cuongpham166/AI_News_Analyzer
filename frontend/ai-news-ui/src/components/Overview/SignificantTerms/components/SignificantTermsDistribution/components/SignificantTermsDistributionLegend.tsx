import { ColorSwatch, Group, SimpleGrid, Text, Stack } from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import {
  NEWS_ENTITY_COLORS,
  NEWS_ENTITIES,
} from '@/shared/constants/NewsEntities.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

const SignificantTermsDistributionLegend = () => {
  return (
    <CustomChartLegend legendName='Entity'>
      <Group gap='md' wrap='wrap'>
        {NEWS_ENTITIES.map((item) => {
          return (
            <Group gap='xs' wrap='nowrap'>
              <ColorSwatch color={NEWS_ENTITY_COLORS[item]} size={12} />
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

export default SignificantTermsDistributionLegend;