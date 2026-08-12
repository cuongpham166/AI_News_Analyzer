import { Box, Divider, Group, Paper, Select, Stack, Text } from '@mantine/core';
import Taskbar from '@/components/generic/Taskbar';
import { NewsFilter, NewsListItem } from '@/components/News/NewsList';
import { ThemeColors } from '@/shared/constants/Colors.ts';
import ListNewsData from '@/shared/test_data/ListNewsData.ts';
function NewsPage() {
  const filteredNews = ListNewsData.data;
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
              {filteredNews.length} articles
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

          {filteredNews.map((article, index) => (
            <Box key={article.id}>
              <NewsListItem
                article={article}
                onClick={()=>{}}
              />

              {index < filteredNews.length - 1 && (
                <Divider color={ThemeColors.border} />
              )}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

export default NewsPage;
