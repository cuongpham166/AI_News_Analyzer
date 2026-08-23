import {
  Badge,
  Box,
  Flex,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import type { ImpactArticle } from '@/shared/types/analysis/media_bias/ImpactArticles.ts';
import {
  ThumbsDownIcon,
  ThumbsUpIcon,
  ArrowSquareOutIcon,
} from '@phosphor-icons/react';
import { NEWS_TOPIC_COLORS } from '@/shared/constants/NewsTopics.ts';
import { NEWS_SOURCES_COLORS, NEWS_SOURCES_NAMES } from '@/shared/constants/NewsSources.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';

interface SentimentArticleItemProps {
  article: ImpactArticle;
  onClick?: (article: ImpactArticle) => void;
}
const SentimentArticleItem = ({
  article,
  onClick,
}: SentimentArticleItemProps) => {
  const isPositive = article.sentiment_label === 'positive';
  const sentimentColor = isPositive ? 'green' : 'red';
  const SentimentIcon = isPositive ? ThumbsUpIcon : ThumbsDownIcon;
  const publishedAt = new Date(article.publish_date * 1000);

  const formattedDate = publishedAt.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = publishedAt.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <Paper
      p='sm'
      radius='md'
      withBorder
      style={{
        cursor: onClick ? 'pointer' : undefined,
        transition: 'background-color 150ms ease, border-color 150ms ease',
      }}
      onClick={() => onClick?.(article)}
    >
      <Group align='flex-start' gap='md' wrap='nowrap'>
        <Box
          style={{
            width: 4,
            alignSelf: 'stretch',
            minHeight: 72,
            borderRadius: 4,
            backgroundColor: NEWS_SENTIMENT_COLORS[article.sentiment_label],
            flexShrink: 0,
          }}
        />

        <Stack
          gap={6}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Stack gap={4}>
            <Text fw={600} size='sm' c='gray.9' lh={1.4} lineClamp={2}>
              {article.title}
            </Text>

            <Text size='xs' c='gray.6'>
              {formattedDate} · {formattedTime}
            </Text>
          </Stack>

          {article.summary && (
            <Text size='sm' c='gray.7' lh={1.5} lineClamp={2}>
              {article.summary}
            </Text>
          )}

          <Group gap={6} mt={2} wrap='wrap'>
            <Badge
              size='xs'
              variant='light'
              color={NEWS_TOPIC_COLORS[article.topic]}
            >
              {article.topic}
            </Badge>

            <Text size='xs' c='gray.6'>
              {NEWS_SOURCES_NAMES[article.source]}
            </Text>
          </Group>
        </Stack>

        <ThemeIcon
          component='a'
          href={article.link}
          target='_blank'
          rel='noopener noreferrer'
          size={32}
          radius='md'
          variant='subtle'
          color='gray'
          onClick={(event) => event.stopPropagation()}
          style={{
            flexShrink: 0,
            transition: 'background-color 150ms ease, color 150ms ease',
          }}
        >
          <ArrowSquareOutIcon size={16} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
};


export default SentimentArticleItem;