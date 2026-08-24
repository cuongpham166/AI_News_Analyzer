import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import {
  Anchor,
  Badge,
  Group,
  Stack,
  Title,
  Text,
  Divider,
} from '@mantine/core';
import { ArrowSquareOutIcon, ArticleIcon } from '@phosphor-icons/react';
import {
  NEWS_SOURCES_COLORS,
  NEWS_SOURCES_NAMES,
} from '@/shared/constants/NewsSources.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { NEWS_TOPIC_COLORS } from '@/shared/constants/NewsTopics.ts';

interface DetailedNewsHeaderProps {
  article: DetailedNews;
}
const DetailedNewsHeader = ({ article }:DetailedNewsHeaderProps) => {
  const published = new Date(article.publishDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const sourceName =
    NEWS_SOURCES_NAMES[article.source.name] ?? article.source.name;

  return (
    <Stack gap='lg'>
      <Group gap='sm' align='center' wrap='wrap'>
        <Badge
          variant='filled'
          color={NEWS_SOURCES_COLORS[article.source.name]}
          size='md'
          radius='sm'
        >
          {sourceName}
        </Badge>

        <Text size='sm' c='dimmed'>
          {published}
        </Text>
      </Group>

      <Title
        order={1}
        fw={700}
        lh={1.15}
        maw={950}
        style={{
          letterSpacing: '-0.02em',
        }}
      >
        {article.title}
      </Title>

      <Group justify='flex-end' pt='xs'>
        <Anchor
          href={article.link}
          target='_blank'
          rel='noopener noreferrer'
          size='sm'
          fw={600}
        >
          <Group gap={6} wrap='nowrap'>
            <Text size='sm'>Read original article</Text>

            <ArrowSquareOutIcon size={15} />
          </Group>
        </Anchor>
      </Group>

      <Divider color={ThemeColors.border} />
    </Stack>
  );
};


export default DetailedNewsHeader;