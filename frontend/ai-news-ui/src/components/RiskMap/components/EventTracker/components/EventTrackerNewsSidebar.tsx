import {
  Drawer,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import {
  useEventGraphNews,
} from '@/hooks/queries/news.query.ts';
import { ArticleIcon} from '@phosphor-icons/react';
import SidebarNewsList from '@/components/generic/SidebarNewsList';

interface Props {
  eventName: string;
  opened: boolean;
  onClose: () => void;
}

const EventTrackerNewsSidebar = ({ eventName, opened, onClose }: Props) => {
  const { data: specificData, isFetching: isSpecificFetching } =
    useEventGraphNews(eventName);

  const newsList = Array.isArray(specificData?.data) ? specificData.data : [];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap='xs'>
          <ArticleIcon size={20} color='#3B82F6' />
          <Text fw={700} size='lg'>
            Related News {eventName ? `— ${eventName}` : ''}
          </Text>
        </Group>
      }
      position='right'
      size='md'
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <SidebarNewsList
        newsList={newsList}
        locationName={eventName}
        isSpecificFetching={isSpecificFetching}
        opened={opened}
      />
    </Drawer>
  );
};

export default EventTrackerNewsSidebar;