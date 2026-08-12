import { Center, Stack, Text } from '@mantine/core';

interface EmptyContentStateProps {
  height: number;
  message: string;
}

const EmptyContentState = ({ height, message }: EmptyContentStateProps) => (
  <Center h={height}>
    <Stack align='center' gap={4}>
      <Text fw={600}>No content data</Text>

      <Text size='sm' c='dimmed' ta='center'>
        {message}
      </Text>
    </Stack>
  </Center>
);


export default EmptyContentState;