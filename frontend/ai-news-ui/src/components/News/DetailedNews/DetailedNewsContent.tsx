import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import { Box, Paper, Stack, Text, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';

interface DetailedNewsHeaderProps {
  article: DetailedNews;
}

const DetailedNewsContent = ({ article }: DetailedNewsHeaderProps) => {
  const paragraphs = article.fullText
    .split(/\n\s*\n/)
    .map((value) => value.trim())
    .filter(Boolean);

  return (
    <Stack gap='lg'>
      <Paper
        p='lg'
        radius='md'
        withBorder
        style={{
          background: ThemeColors.secondary,
          borderColor: ThemeColors.border,
        }}
      >
        <Stack gap='xs'>
          <Text size='sm' fw={600} c='dimmed'>
            Summary
          </Text>

          <Text size='md' lh={1.65}>
            {article.inference.summary.trim()}
          </Text>
        </Stack>
      </Paper>

      {/* Article */}
      {paragraphs.map((paragraph, index) => {
        const isHeading = paragraph.length < 80 && !paragraph.endsWith('.') && index > 0;

        if (isHeading) {
          return (
            <Title key={index} order={3} mt='xl' mb='md' fw={650}>
              {paragraph}
            </Title>
          );
        }

        return (
          <Text key={index} size='md' lh={1.8} mb='lg'>
            {paragraph}
          </Text>
        );
      })}
    </Stack>
  );
};


export default DetailedNewsContent;