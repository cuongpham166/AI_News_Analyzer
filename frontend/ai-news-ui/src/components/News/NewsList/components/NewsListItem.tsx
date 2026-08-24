import type { News } from '@/shared/types/news/News.ts';
import {
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { ArrowRightIcon } from '@phosphor-icons/react';
import {
  NEWS_SOURCES_COLORS,
  NEWS_SOURCES_NAMES,
} from '@/shared/constants/NewsSources.ts';

function NewsListItem({
  article,
  onClick,
}: {
  article: News;
  onClick: (articleId:string) => void;
}) {
  const published = new Date(article.publishDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const source = NEWS_SOURCES_NAMES[article.source.name] ?? article.source.name;

  return (
    <UnstyledButton
      onClick={()=>onClick(article.id as string)}
      w='100%'
      style={{
        display: 'block',
        textAlign: 'left',
      }}
    >
      <Box
        py='lg'
        px='sm'
        style={{
          borderRadius: 8,
          transition: 'background-color 120ms ease, transform 120ms ease',

          '&:hover': {
            backgroundColor: 'var(--mantine-color-gray-0)',
          },
        }}
      >
        <Group justify='space-between' align='center' gap='xl' wrap='nowrap'>
          <Stack
            gap={8}
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Text fw={600} size='md' lh={1.45} lineClamp={2}>
              {article.title}
            </Text>

            <Group gap='sm' wrap='nowrap'>
              <Badge
                size='xs'
                variant='filled'
                color={NEWS_SOURCES_COLORS[article.source.name]}
                radius='sm'
              >
                {source}
              </Badge>

              <Text size='xs' c='dimmed'>
                {published}
              </Text>
            </Group>
          </Stack>

          <ArrowRightIcon size={18} color='var(--mantine-color-gray-5)' />
        </Group>
      </Box>
    </UnstyledButton>
  );
}

export default NewsListItem;