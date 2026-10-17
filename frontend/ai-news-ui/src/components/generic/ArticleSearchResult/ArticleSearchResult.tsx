import dayjs from 'dayjs';
import { Badge, Group, Stack, Text } from '@mantine/core';
import { NEWS_SOURCES_COLORS } from '@/shared/constants/NewsSources.ts';
import type { SearchedNewsResult } from '@/shared/types/news/SearchedNews.ts';


type ArticleSearchResultProps = {
  article: SearchedNewsResult;
};

const ArticleSearchResult = ({ article }: ArticleSearchResultProps) => {
  return (
    <Stack gap={6}>
      <Group justify='space-between' gap='xs' wrap='nowrap'>
        <Group gap={6}>
          <Badge
            size='sm'
            variant='filled'
            color={NEWS_SOURCES_COLORS[article.source]}
            radius='sm'
          >
            {article.source}
          </Badge>
          <Text size='xs' c='dimmed'>
            ·
          </Text>
          <Text size='xs' c='dimmed'>
            {dayjs.unix(article.publish_date).format('MMM D, YYYY')}
          </Text>
        </Group>
      </Group>

      <Text size='sm' fw={600} lineClamp={2}>
        {article.title}
      </Text>

      <Text size='xs' c='dimmed' lineClamp={2}>
        {article.summary}
      </Text>
    </Stack>
  );
};

export default ArticleSearchResult;