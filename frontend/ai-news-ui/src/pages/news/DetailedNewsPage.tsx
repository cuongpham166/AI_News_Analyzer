import {
  Anchor, Box,
  Divider,
  Grid,
  Group,
  NavLink,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import Taskbar from '@/components/generic/Taskbar';
import DetailedNewsData from '@/shared/test_data/DetailedNewsData.ts';
import { ArrowCircleLeftIcon, HouseIcon } from '@phosphor-icons/react';
import type { DetailedNews } from '@/shared/types/DetailedNews.ts';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import {
  DetailedNewsHeader,
  DetailedNewsContent,
  DetailedNewsInsights,
} from '@/components/News/DetailedNews';

function DetailedNewsPage() {
  const detailedNews = DetailedNewsData.data;
  return (
    <Stack>
      <Taskbar taskbarTitle='Detailed News' />
      {/*Header*/}
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
            >
              <ArrowCircleLeftIcon size={16} />
              Back to news
            </Anchor>
          </Stack>
        </Grid.Col>
      </Grid>
      {/*Header*/}
      {/*Main*/}
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
              <DetailedNewsHeader article={detailedNews} />
              <Divider color={ThemeColors.border} />
              <DetailedNewsContent article={detailedNews} />
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={4}>
          <DetailedNewsInsights article={detailedNews} />
        </Grid.Col>
      </Grid>
      {/*Main*/}
      {/*Footer*/}
      <Grid gap='md'>
        <Grid.Col span={12}></Grid.Col>
      </Grid>
      {/*Footer*/}
    </Stack>
  );
}

export default DetailedNewsPage;
