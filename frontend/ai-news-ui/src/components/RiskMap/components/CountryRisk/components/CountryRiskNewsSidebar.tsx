import {
  Drawer,
  Group,
  ScrollArea,
  Text,
} from '@mantine/core';
import {
  useCountryGraphNews,
} from '@/hooks/queries/news.query.ts';
import { ArticleIcon} from '@phosphor-icons/react';
import SidebarNewsList from '@/components/generic/SidebarNewsList';

interface Props {
  locationName: string;
  opened: boolean;
  onClose: () => void;
}

const CountryRiskNewsSidebar = ({ locationName, opened, onClose }: Props) => {
  const { data: specificData, isFetching: isSpecificFetching } =
    useCountryGraphNews(locationName);

  console.log('CountryRiskNewsSidebar', locationName);
  const newsList = Array.isArray(specificData?.data) ? specificData.data : [];

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group gap='xs'>
          <ArticleIcon size={20} color='#3B82F6' />
          <Text fw={700} size='lg'>
            Related News {locationName ? `— ${locationName}` : ''}
          </Text>
        </Group>
      }
      position='right'
      size='md'
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <SidebarNewsList
        newsList={newsList}
        locationName={locationName}
        isSpecificFetching={isSpecificFetching}
        opened={opened}
      />
    </Drawer>
  );
};

export default CountryRiskNewsSidebar;