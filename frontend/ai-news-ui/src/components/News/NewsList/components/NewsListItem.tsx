import type { News } from '@/shared/types/News.ts';
import { Badge, Box, Button, Group, Stack, Text } from '@mantine/core';
import { ArrowRightIcon } from '@phosphor-icons/react';

function NewsListItem({
  article,
  onClick,
}: {
  article: News;
  onClick: () => void;
}) {
  const published = new Date(article.publishDate).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Box
      py='lg'
      style={{
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      <Group justify='space-between' align='flex-start' gap='xl' wrap='nowrap'>
        <Stack gap={6} style={{ minWidth: 0 }}>
          <Text fw={600} size='md' lh={1.4}>
            {article.title}
          </Text>

          <Group gap='xs'>
            <Badge size='sm' variant='light' color='blue'>
              {article.source.name}
            </Badge>

            <Text size='sm' c='dimmed'>
              ·
            </Text>

            <Text size='sm' c='dimmed'>
              {published}
            </Text>
          </Group>
        </Stack>

        <Button
          variant='subtle'
          size='sm'
          rightSection={<ArrowRightIcon size={16} />}
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
        >
          Read
        </Button>
      </Group>
    </Box>
  );
}

export default NewsListItem;