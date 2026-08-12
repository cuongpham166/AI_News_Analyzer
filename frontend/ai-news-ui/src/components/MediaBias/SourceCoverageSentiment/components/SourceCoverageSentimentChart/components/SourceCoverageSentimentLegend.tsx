import { ColorSwatch, Group, Text} from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
import { NEWS_SOURCES_COLORS, NEWS_SOURCES } from '@/shared/constants/NewsSources.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';

const SourceCoverageSentimentLegend = () => {
  return (
    <CustomChartLegend legendName='Sources'>
      <Group gap='md' wrap='wrap'>
        {NEWS_SOURCES.map((item) => {
          return (
            <Group gap='xs' wrap='nowrap'>
              <ColorSwatch color={NEWS_SOURCES_COLORS[item]} size={12} />
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


export default SourceCoverageSentimentLegend;