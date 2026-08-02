import { ColorSwatch, Group, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import CustomChartLegend from '@/components/generic/CustomChart/CustomChartLegend';
const EntityPolarizationLegend = () =>{
  return (
    <CustomChartLegend legendName="Quadrant Guide">
      <SimpleGrid cols={2} spacing='xs'>
        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#ffc0cb' size={12} />
          <Stack gap={0}>
            <Text size='sm' fw={500}>
              Mixed Positive
            </Text>
            <Text size='xs' c='dimmed'>
              Positive sentiment • High variation
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#add8e6' size={12} />
          <Stack gap={0}>
            <Text size='sm' fw={500}>
              Mixed Negative
            </Text>
            <Text size='xs' c='dimmed'>
              Negative sentiment • High variation
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#fff8b3' size={12} />
          <Stack gap={0}>
            <Text size='sm' fw={500}>
              Consistent Positive
            </Text>
            <Text size='xs' c='dimmed'>
              Positive sentiment • Low variation
            </Text>
          </Stack>
        </Group>

        <Group gap='xs' wrap='nowrap'>
          <ColorSwatch color='#90ee90' size={12} />
          <Stack gap={0}>
            <Text size='sm' fw={500}>
              Consistent Negative
            </Text>
            <Text size='xs' c='dimmed'>
              Negative sentiment • Low variation
            </Text>
          </Stack>
        </Group>
      </SimpleGrid>
    </CustomChartLegend>

  );
}


export default EntityPolarizationLegend;