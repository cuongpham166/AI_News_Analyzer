import type { SimilarNews } from '@/shared/types/news/SimilarNews.ts';
import {
  Badge,
  Box,
  Group,
  Stack,
  Tooltip,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  NEWS_SOURCES_COLORS,
  NEWS_SOURCES_NAMES,
} from '@/shared/constants/NewsSources.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import { ArrowRightIcon } from '@phosphor-icons/react';

interface Props {
  article: SimilarNews;
  onClick: (articleId: string) => void;
}

const SimilarNewsListItem = ({ article, onClick }: Props) => {
  const formatScore = (score?: number | null) =>
    score == null ? '—' : `${(score * 100).toFixed(1)}%`;

  const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

  const published = new Date(
    Number(article.publish_date) * 1000,
  ).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const source = NEWS_SOURCES_NAMES[article.source] ?? article.source;

  return (
    <UnstyledButton
      onClick={() => onClick(article.id as string)}
      w='100%'
      style={{
        display: 'block',
        textAlign: 'left',
      }}
    >
      <Box
        py='md'
        px='sm'
        style={{
          borderRadius: 8,
          transition: 'background-color 120ms ease',
          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-0)',
          },
        }}
      >
        <Stack gap='xs'>
          <Group justify='space-between' align='center' gap='sm' wrap='nowrap'>
            <Group gap='sm' wrap='nowrap'>
              <Badge
                size='md'
                variant='filled'
                color={NEWS_SOURCES_COLORS[article.source]}
                radius='sm'
              >
                {source}
              </Badge>

              <Text size='xs' c='dimmed'>
                {published}
              </Text>
            </Group>

            <Tooltip
              label='Overall similarity ranking, combining semantic similarity with related news signals.'
              withArrow
            >
              <Badge size='md' variant='light' color='violet' radius='sm'>
                Ranking {formatScore(article.rankingScore)}
              </Badge>
            </Tooltip>
          </Group>

          <Group
            justify='space-between'
            align='flex-start'
            gap='md'
            wrap='nowrap'
          >
            <Text
              fw={600}
              size='lg'
              lh={1.4}
              lineClamp={2}
              style={{ minWidth: 0 }}
            >
              {article.title}
            </Text>

            <ArrowRightIcon
              size={18}
              color='var(--mantine-color-gray-5)'
              style={{
                flexShrink: 0,
                marginTop: 3,
              }}
            />
          </Group>

          <Text size='sm' c='dimmed' lh={1.5} lineClamp={2}>
            {article.summary}
          </Text>

          <Group gap='xs' mt={2}>
            <Tooltip
              label='Semantic similarity between this article and the selected news, based on their content.'
              withArrow
            >
              <Badge size='md' variant='light' color='blue' radius='sm'>
                Semantic {formatScore(article.similarScore)}
              </Badge>
            </Tooltip>

            {article.sentiment_label && (
              <Badge
                size='md'
                variant='light'
                color={NEWS_SENTIMENT_COLORS[article.sentiment_label]}
                radius='sm'
              >
                {capitalize(article.sentiment_label)}
              </Badge>
            )}
          </Group>
        </Stack>
      </Box>
    </UnstyledButton>
  );
};


export default SimilarNewsListItem;