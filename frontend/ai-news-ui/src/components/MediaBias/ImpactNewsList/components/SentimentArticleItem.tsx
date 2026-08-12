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
import type { ImpactArticle } from '@/shared/types/analysis/ImpactArticles.ts';
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  ArrowSquareOutIcon,
} from '@phosphor-icons/react';
import { NEWS_TOPIC_COLORS } from '@/shared/constants/NewsTopics.ts';
import { NEWS_SOURCES_COLORS } from '@/shared/constants/NewsSources.ts';
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
  const SentimentIcon = isPositive ? ArrowCircleUpIcon : ArrowCircleDownIcon; ;
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
      p='md'
      radius='md'
      withBorder
      style={{
        cursor: onClick ? 'pointer' : undefined,
        transition: 'background-color 150ms ease, border-color 150ms ease',
      }}
      onClick={() => onClick?.(article)}
    >
      <Group align='flex-start' gap='md' wrap='nowrap'>
        <ThemeIcon
          size={40}
          radius='xl'
          variant='light'
          color={NEWS_SENTIMENT_COLORS[article.sentiment_label]}
          style={{
            flexShrink: 0,
          }}
        >
          <SentimentIcon size={20} />
        </ThemeIcon>

        <Stack
          gap={6}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Flex
            justify='flex-start'
            align='center'
            direction='row'
            wrap='wrap'
            gap='sm'
          >
            <Text fw={600} size='sm' lineClamp={2}>
              {article.title}
            </Text>
            <Text size='xs' c='dimmed'>
              {formattedDate} · {formattedTime}
            </Text>
          </Flex>

          {article.summary && (
            <Text size='xs' c='dimmed' lineClamp={2}>
              {article.summary}
            </Text>
          )}

          <Group gap='xs' mt={2} wrap='wrap'>
            <Badge
              size='xs'
              variant='filled'
              color={NEWS_SENTIMENT_COLORS[article.sentiment_label]}
            >
              {article.sentiment_label}
            </Badge>

            <Badge
              size='xs'
              variant='filled'
              color={NEWS_SOURCES_COLORS[article.source]}
            >
              {article.source}
            </Badge>

            <Badge
              size='xs'
              variant='filled'
              color={NEWS_TOPIC_COLORS[article.topic]}
            >
              {article.topic}
            </Badge>
          </Group>
        </Stack>

        <ThemeIcon
          component='a'
          href={article.link}
          target='_blank'
          rel='noopener noreferrer'
          size={30}
          radius='md'
          variant='subtle'
          color='gray'
          onClick={(event) => event.stopPropagation()}
          style={{
            flexShrink: 0,
          }}
        >
          <ArrowSquareOutIcon size={15} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
};


export default SentimentArticleItem;