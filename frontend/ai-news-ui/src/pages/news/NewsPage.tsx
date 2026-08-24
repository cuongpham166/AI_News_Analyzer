import { Box, Divider, Group, Pagination, Paper, Select, Stack, Text } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';
import { NewsFilter, NewsListItem } from '@/components/News/NewsList';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import { useNewsList } from '@/hooks/queries/news.query.ts';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { notifications } from '@mantine/notifications';
import PageLoader from '@/components/generic/PageLoader';
import { useNavigate } from 'react-router-dom';

function NewsPage() {
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 10;
  const { data, isLoading, isFetching, error } = useNewsList(100)
  const [activePage, setActivePage] = useState(1);

  const wasFetching = useRef(false);

  const totalPages = data ?  Math.ceil(data.length / ITEMS_PER_PAGE): 0;
  const paginatedNews = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return data ? data.slice(start, start + ITEMS_PER_PAGE) : [];
    }, [data, activePage]);


  useEffect(() => {
    if (isFetching) {
      wasFetching.current = true;
      return;
    }

    if (wasFetching.current && data) {
      notifications.show({
        title: 'News List updated',
        message: 'The latest data is now available.',
        color: 'green',
        position: 'bottom-right',
      });

      wasFetching.current = false;
    }
  }, [isFetching, data]);

  if (isLoading && !data) {
    return <PageLoader />;
  }

  if (error && !data) {
    return <div>Error loading news</div>;
  }

  return (
    <Stack gap='lg'>
      <Taskbar taskbarTitle='News' />
      <NewsFilter />
      <Paper
        p='lg'
        radius='lg'
        withBorder
        style={{
          background: ThemeColors.third,
          borderColor: ThemeColors.border,
        }}
      >
        <Stack gap={0}>
          <Group justify='space-between' mb='xs'>
            <Text size='sm' c='dimmed'>
              {data ? data.length : 0} articles
            </Text>

            <Select
              size='sm'
              w={150}
              data={[
                {
                  value: 'newest',
                  label: 'Newest',
                },
                {
                  value: 'oldest',
                  label: 'Oldest',
                },
              ]}
              defaultValue='newest'
            />
          </Group>

          {data?.length ? (
            <Stack gap={0}>
              {paginatedNews.map((article, index) => (
                <Box key={article.id}>
                  <NewsListItem
                    article={article}
                    onClick={(newsId:string) => {
                      navigate(`/news/${newsId}`);
                    }}
                  />

                  {index < data.length - 1 && (
                    <Divider color={ThemeColors.border} />
                  )}
                </Box>
              ))}
              {totalPages > 1 && (
                <Group justify='center' pt='xs'>
                  <Pagination
                    total={totalPages}
                    value={activePage}
                    onChange={setActivePage}
                    size='sm'
                    radius='md'
                    withEdges
                  />
                </Group>
              )}
            </Stack>
          ) : (
            <Text size='sm' c='dimmed' ta='center' py='xl'>
              No news articles found.
            </Text>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

export default NewsPage;
