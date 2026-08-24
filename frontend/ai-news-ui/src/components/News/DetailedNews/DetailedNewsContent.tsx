import type { DetailedNews } from '@/shared/types/news/DetailedNews.ts';
import { Blockquote, Box, Paper, Stack, Text, Title } from '@mantine/core';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { InfoIcon } from '@phosphor-icons/react';

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
      <Blockquote
        color={ThemeColors.primary}
        iconSize={38}
        cite='– Summarized by distilbart-cnn-12-6 - '
        icon={<InfoIcon size={20} />}
        mt='xl'
      >
        {article.inference.summary.trim()}
      </Blockquote>

      {/* Article */}
      {paragraphs.map((paragraph, index) => {
        const isHeading =
          paragraph.length < 80 && !paragraph.endsWith('.') && index > 0;

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