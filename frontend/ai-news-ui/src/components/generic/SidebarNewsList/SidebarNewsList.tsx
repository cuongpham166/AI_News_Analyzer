import {
  Badge,
  Box,
  Card,
  Drawer,
  Group,
  Pagination,
  ScrollArea,
  Skeleton,
  Stack,
  Text, UnstyledButton,
} from '@mantine/core';
import {CalendarIcon } from '@phosphor-icons/react';
import { NEWS_SOURCES_COLORS } from '@/shared/constants/NewsSources.ts';
import { NEWS_SENTIMENT_COLORS } from '@/shared/constants/NewsSentiments.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  newsList: any;
  isSpecificFetching: boolean;
  locationName: string;
  opened: boolean;
}

const PAGE_SIZE = 5;

const getSentimentBadge = (sentimentScore: number) => {
  const isPositive = sentimentScore >= 0;
  const confidencePct = Math.round(Math.abs(sentimentScore) * 100);

  return {
    color: isPositive
      ? NEWS_SENTIMENT_COLORS['positive']
      : NEWS_SENTIMENT_COLORS['negative'],
    label: `${isPositive ? 'Positive' : 'Negative'} (${confidencePct}%)`,
  };
};

const formatDate = (isoString: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return isNaN(date.getTime())
    ? isoString
    : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
};

const SidebarNewsList = ({
  newsList,
  isSpecificFetching,
  locationName,
  opened,
}: Props) => {
  const [activePage, setActivePage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    if (opened) {
      setActivePage(1);
    }
  }, [locationName, opened]);

  const totalPages = Math.ceil(newsList.length / PAGE_SIZE);
  const paginatedNews = newsList.slice(
    (activePage - 1) * PAGE_SIZE,
    activePage * PAGE_SIZE,
  );

  const onClickNewsItem = (contentHash:string) => {
    navigate(`/news/hash/${contentHash}`);
  };
  return (
    <Stack justify='space-between' h='calc(100vh - 80px)' mt='sm'>
      <Stack gap='md' mt='sm'>
        {isSpecificFetching && (
          <>
            <Skeleton height={110} radius='md' />
            <Skeleton height={110} radius='md' />
            <Skeleton height={110} radius='md' />
          </>
        )}

        {!isSpecificFetching && newsList.length === 0 && (
          <Text c='dimmed' fs='italic' ta='center' py='xl'>
            No recent news coverage found for {locationName}.
          </Text>
        )}

        {!isSpecificFetching &&
          paginatedNews.map((news, index) => {
            const badge = getSentimentBadge(news.sentiment);

            return (
              <UnstyledButton
                onClick={() => onClickNewsItem(news.contentHash as string)}
                w='100%'
                style={{
                  display: 'block',
                  textAlign: 'left',
                }}
              >
                <Card
                  key={`${news.title}-${index}`}
                  shadow='xs'
                  padding='sm'
                  radius='md'
                  withBorder
                >
                  <Stack gap='xs'>
                    <Group justify='space-between' align='center'>
                      <Badge
                        variant='light'
                        color={NEWS_SOURCES_COLORS[news.source]}
                        size='sm'
                      >
                        {news.source || 'UNKNOWN'}
                      </Badge>
                      <Badge variant='filled' color={badge.color} size='sm'>
                        {badge.label}
                      </Badge>
                    </Group>

                    <Text fw={600} size='sm' lineClamp={3} lh={1.4}>
                      {news.title}
                    </Text>

                    <Group justify='space-between' align='center' mt={4}>
                      <Group gap={4} align='center'>
                        <CalendarIcon size={13} color='#9CA3AF' />
                        <Text size='xs' c='dimmed'>
                          {formatDate(news.date)}
                        </Text>
                      </Group>
                    </Group>
                  </Stack>
                </Card>
              </UnstyledButton>
            );
          })}
      </Stack>
      {!isSpecificFetching && totalPages > 1 && (
        <Box pt='xs' pb='sm' style={{ borderTop: '1px solid #E2E8F0' }}>
          <Group justify='center'>
            <Pagination
              value={activePage}
              onChange={setActivePage}
              total={totalPages}
              size='sm'
              radius='md'
              withEdges
            />
          </Group>
        </Box>
      )}
    </Stack>
  );
};

export default SidebarNewsList;
