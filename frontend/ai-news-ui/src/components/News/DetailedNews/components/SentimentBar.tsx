import { Box, Group, Text } from '@mantine/core';

type SentimentLabel = 'positive' | 'negative';

interface SentimentBarProps {
  label: string; //'positive' | 'negative'
  score: number;
  height?: number;
}

const SentimentBar = ({ label, score, height = 8 }: SentimentBarProps) => {
  const magnitude = Math.max(0, Math.min(1, score));
  const value =
    label === 'negative' ? -magnitude : label === 'positive' ? magnitude : 0;
  const position = 50 + value * 50;

  const color = value > 0 ? '#2f9e44' : value < 0 ? '#e03131' : '#868e96';

  const formattedValue = value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);

  return (
    <Box>
      <Group justify='space-between' align='center' mb={8}>
        <Text size='xs' c='red.7'>
          Negative
        </Text>

        <Text size='sm' fw={600} c={color}>
          {formattedValue}
        </Text>

        <Text size='xs' c='green.7'>
          Positive
        </Text>
      </Group>

      <Box
        pos='relative'
        h={height}
        style={{
          borderRadius: 999,
          background:
            'linear-gradient(to right, #fa5252 0%, #f1f3f5 50%, #40c057 100%)',
        }}
      >
        {/* Neutral / zero marker */}
        <Box
          pos='absolute'
          top={-4}
          bottom={-4}
          left='50%'
          style={{
            width: 2,
            backgroundColor: '#868e96',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Sentiment marker */}
        <Box
          pos='absolute'
          top='50%'
          left={`${position}%`}
          w={16}
          h={16}
          style={{
            borderRadius: '50%',
            backgroundColor: color,
            border: '2px solid white',
            boxShadow: '0 1px 5px rgba(0, 0, 0, 0.25)',
            transform: 'translate(-50%, -50%)',
            transition: 'left 200ms ease, background-color 200ms ease',
          }}
        />
      </Box>
    </Box>
  );
};

export default SentimentBar;