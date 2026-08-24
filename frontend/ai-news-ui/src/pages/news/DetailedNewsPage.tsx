import { Anchor, Box, Divider, Grid, Paper, Stack, Text } from '@mantine/core';

import Taskbar from '@/components/generic/Taskbar';
import { ArrowCircleLeftIcon, HouseIcon } from '@phosphor-icons/react';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import {
  DetailedNewsHeader,
  DetailedNewsContent,
  DetailedNewsInsights,
} from '@/components/News/DetailedNews';
import { useNavigate, useParams } from 'react-router-dom';
import {useDetailNews, useSimilarNews } from '@/hooks/queries/news.query.ts';
import React, { useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import PageLoader from '@/components/generic/PageLoader';
import { SimilarNewsListItem } from '@/components/News/SimilarNewsList';

function DetailedNewsPage() {
  const navigate = useNavigate();
  const { Id } = useParams();

  const detailedNewsQuery = useDetailNews(Id);
  const similarNewsQuery = useSimilarNews(Id,10);

  const isFetching =detailedNewsQuery.isFetching && similarNewsQuery.isFetching;
  const isLoading = detailedNewsQuery.isLoading && similarNewsQuery.isLoading;
  const error = detailedNewsQuery.error && similarNewsQuery.error;
  const hasData = detailedNewsQuery.data && similarNewsQuery.data;

  const hasSimilarNewsData = similarNewsQuery.data && similarNewsQuery.data.length > 0;
  const wasFetching = useRef(false);

  useEffect(() => {
    if (isFetching) {
      wasFetching.current = true;
      return;
    }

    if (wasFetching.current && hasData) {
      notifications.show({
        title: 'News Detail updated',
        message: 'The latest data is now available.',
        color: 'green',
        position: 'bottom-right',
      });

      wasFetching.current = false;
    }
  }, [isFetching, hasData]);

  if (isLoading && !hasData) {
    return <PageLoader />;
  }

  if (error && !hasData) {
    return <div>Error loading news</div>;
  }

  return (
    <Stack>
      <Taskbar taskbarTitle='Detailed News' />
      {detailedNewsQuery.data ? (
        <>
          <Grid gap='md'>
            <Grid.Col span={12}>
              <Stack gap='md'>
                <Anchor
                  component='button'
                  type='button'
                  fw={500}
                  size='sm'
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    width: 'fit-content',
                  }}
                  onClick={() => navigate(-1)}
                >
                  <ArrowCircleLeftIcon size={16} />
                  Back to news
                </Anchor>
              </Stack>
            </Grid.Col>
          </Grid>

          <Grid gap='md'>
            <Grid.Col span={8}>
              <Paper
                p='xl'
                radius='lg'
                withBorder
                style={{
                  background: ThemeColors.third,
                  borderColor: ThemeColors.border,
                }}
              >
                <Stack gap='xl'>
                  <DetailedNewsHeader article={detailedNewsQuery.data} />
                  <DetailedNewsContent article={detailedNewsQuery.data} />
                </Stack>
              </Paper>
            </Grid.Col>
            <Grid.Col span={4}>
              <DetailedNewsInsights article={detailedNewsQuery.data} />
            </Grid.Col>
          </Grid>

          {hasSimilarNewsData && (
            <Paper
              p='xl'
              radius='lg'
              withBorder
              style={{
                background: ThemeColors.third,
                borderColor: ThemeColors.border,
              }}
            >
              <Stack gap='md'>
                <div>
                  <Text fw={600} size='lg'>
                    Similar News
                  </Text>

                  <Text size='sm' c='dimmed'>
                    Related articles based on content and context
                  </Text>
                </div>

                <Stack gap='xs'>
                  {similarNewsQuery.data.map((article, index) => (
                    <Box key={article.id}>
                      <SimilarNewsListItem
                        key={article.id}
                        article={article}
                        onClick={(newsId: string) => {
                          navigate(`/news/${newsId}`);
                        }}
                      />
                      {index < similarNewsQuery.data.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </Paper>
          )}
        </>
      ) : (
        <></>
      )}
    </Stack>
  );
}

export default DetailedNewsPage;
