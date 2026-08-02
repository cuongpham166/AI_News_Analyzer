import { Card, SimpleGrid, Text, Tooltip } from '@mantine/core';

function KpiMetricsHeader() {
  const amplificationTooltipText = 'Measures media repetition by calculating how many times each unique story is republished across outlets, ' +
    'exposing whether high news volume is driven by genuine breaking events or echo-chamber syndication.';
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing='md'>
      <Card withBorder padding='lg' radius='md'>
        <Text size='sm' c='dimmed' tt='uppercase' fw={700}>
          Total Articles
        </Text>
        <Text size='xl' fw={700} mt={4}>
          409
        </Text>
      </Card>
      <Card withBorder padding='lg' radius='md'>
        <Text size='sm' c='dimmed' tt='uppercase' fw={700}>
          Unique Stories
        </Text>
        <Text size='xl' fw={700} mt={4}>
          409
        </Text>
      </Card>
      <Card withBorder padding='lg' radius='md'>
        <Tooltip label={<Text size='sm'>{amplificationTooltipText}</Text>}>
          <Text size='sm' c='dimmed' tt='uppercase' fw={700}>
            Amplification Ratio & Health Index
          </Text>
        </Tooltip>
        <Text size='xl' fw={700} mt={4}>
          1.0
        </Text>
      </Card>
    </SimpleGrid>
  );
}

export default KpiMetricsHeader;
