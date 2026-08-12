import {
  Box,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
function MetricsHeader() {
  const amplificationTooltipText = 'Measures media repetition by calculating how many times each unique story is republished across outlets, ' +
    'exposing whether high news volume is driven by genuine breaking events or echo-chamber syndication.';
  const metrics = [
    {
      label: 'Total Articles',
      value: '409',
    },
    {
      label: 'Unique Stories',
      value: '409',
    },
    {
      label: 'Amplification Ratio',
      value: '1.0',
      tooltip: amplificationTooltipText,
    },
  ];

  return (
    <SimpleGrid
      cols={{
        base: 1,
        sm: 3,
      }}
      spacing='md'
    >
      {metrics.map((metric) => (
        <Paper
          key={metric.label}
          p='lg'
          radius='lg'
          withBorder
          style={{
            background: ThemeColors.third,
            borderColor: ThemeColors.border,
          }}
        >
          <Stack gap={6}>
            {metric.tooltip ? (
              <Tooltip
                label={<Text size='xs'>{metric.tooltip}</Text>}
                multiline
                w={300}
              >
                <Text
                  size='xs'
                  fw={600}
                  tt='uppercase'
                  c={ThemeColors.textSecondary}
                  style={{
                    cursor: 'help',
                  }}
                >
                  {metric.label}
                </Text>
              </Tooltip>
            ) : (
              <Text
                size='xs'
                fw={600}
                tt='uppercase'
                c={ThemeColors.textSecondary}
              >
                {metric.label}
              </Text>
            )}

            <Text size='2rem' lh={1} fw={700} c={ThemeColors.text}>
              {metric.value}
            </Text>
          </Stack>
        </Paper>
      ))}
    </SimpleGrid>
  );
}

export default MetricsHeader;
