import {
  Badge,
  Pagination,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import type { EchoChamber } from '@/shared/types/analysis/EchoChamber.ts';
import { useState } from 'react';
import { NEWS_SOURCES_COLORS } from '@/shared/constants/NewsSources.ts';

const ContentClusterList = ({ data }: { data: EchoChamber[] }) => {
  const [activePage, setActivePage] = useState(1);
  const rowsPerPage = 5;
  const paginatedData = data.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage,
  );

  const rows = paginatedData
    .flatMap((item) =>
      item.publishers.map((publisher) => ({
        ...item,
        publisher: publisher.publisher,
        articleCount: publisher.articleCount,
      })),
    )
    .sort((a, b) => b.articleCount - a.articleCount);

  return (
    <Stack>
      <Table highlightOnHover verticalSpacing='sm'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Content</Table.Th>
            <Table.Th>Publisher</Table.Th>
            <Table.Th ta='right'>Articles</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {rows.map((item) => (
            <Table.Tr key={`${item.contentHash}-${item.publisher}`}>
              <Table.Td>
                <Text size='sm' fw={500} lineClamp={2} maw={600}>
                  {item.sampleTitle}
                </Text>
              </Table.Td>

              <Table.Td>
                <Badge
                  variant='light'
                  size='sm'
                  color={NEWS_SOURCES_COLORS[item.publisher]}
                >
                  {item.publisher}
                </Badge>
              </Table.Td>

              <Table.Td ta='right'>
                <Text size='sm' fw={600}>
                  {item.articleCount}
                </Text>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Pagination
        mt='md'
        value={activePage}
        onChange={setActivePage}
        total={Math.ceil(data.length / rowsPerPage)}
      />
    </Stack>
  );
};

export default ContentClusterList;
