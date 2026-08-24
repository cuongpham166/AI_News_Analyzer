import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import { Badge, Stack, Text } from '@mantine/core';
import { NEWS_TOPIC_COLORS } from '@/shared/constants/NewsTopics.ts';
import { ArticleIcon } from '@phosphor-icons/react';

const TopicSection = ({ topic }: DetailedNews['inference']['topic']) => {
  return (
    <Stack gap='sm'>
      <Text size='sm' fw={600}>
        Topic
      </Text>

      <Badge
        variant='light'
        color={NEWS_TOPIC_COLORS[topic.name]}
        size='lg'
        radius='sm'
        w='fit-content'
        leftSection={<ArticleIcon size={20} />}
      >
        {topic.name}
      </Badge>
    </Stack>
  );
};

export default TopicSection;
