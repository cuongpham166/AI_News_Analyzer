import type { DetailedNews } from '@/shared/types/DetailedNews.ts';
import { Badge, Stack, Text } from '@mantine/core';

const TopicSection = ({ topic }: DetailedNews['inference']['topic']) => {
  return (
    <Stack gap='sm'>
      <Text size='sm' fw={600}>
        Topic
      </Text>

      <Badge variant='light' color='blue' size='lg' w='fit-content'>
        {topic.name}
      </Badge>
    </Stack>
  );
};

export default TopicSection;
