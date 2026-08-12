import type { DetailedNews } from '@/shared/types/DetailedNews.ts';
import { Anchor, Badge, Group, Stack, Title,Text } from '@mantine/core';
import { ArrowSquareOutIcon, ArticleIcon } from '@phosphor-icons/react';

interface DetailedNewsHeaderProps {
  article: DetailedNews;
}
const DetailedNewsHeader = ({ article }:DetailedNewsHeaderProps) => {
  const published = new Date(article.publishDate).toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );

  return (
    <Stack gap='md'>
      <Group gap='xs'>
        <Badge
          variant='light'
          color='blue'
          leftSection={<ArticleIcon size={13} />}
        >
          {article.inference.topic.name}
        </Badge>

        <Text size='sm' c='dimmed'>
          {article.source.name}
        </Text>

        <Text size='sm' c='dimmed'>
          ·
        </Text>

        <Text size='sm' c='dimmed'>
          {published}
        </Text>
      </Group>

      <Title order={2} fw={700} lh={1.15} maw={900}>
        {article.title}
      </Title>

      <Group justify='space-between' align='center'>
        <Text size='sm' c='dimmed'>
          {article.source.name}
        </Text>

        <Anchor
          href={article.link}
          target='_blank'
          rel='noopener noreferrer'
          size='sm'
          fw={500}
        >
          <Group gap={6}>
            Read original
            <ArrowSquareOutIcon size={15} />
          </Group>
        </Anchor>
      </Group>
    </Stack>
  );
};


export default DetailedNewsHeader;