import { Table, Badge, Progress, Group, Text, Pagination } from '@mantine/core';
import type {EntityPolarizationType} from '@/shared/interfaces/analysis/EntityNetworkLab/EntityPolarizationType.ts';
import { useState } from 'react';

interface EntityPolarizationTableProps {
  data: EntityPolarizationType[];
}

function compare(a: EntityPolarizationType, b: EntityPolarizationType) {
  if (a.totalArticles > b.totalArticles) {
    return -1;
  }
  if (a.totalArticles < b.totalArticles) {
    return 1;
  }
  return 0;
}

const EntityPolarizationTable = ({data}:EntityPolarizationTableProps) => {
  data.sort(compare);
  const [activePage, setActivePage] = useState(1);
  const rowsPerPage = 10;
  const paginatedData = data.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage,
  );

  const rows = paginatedData.map((item) => {
    const getPolarizationBadge = (score: number) => {
      if (score >= 0.35)
        return (
          <Badge color='red' variant='light'>
            High ({score})
          </Badge>
        );
      if (score >= 0.15)
        return (
          <Badge color='yellow' variant='light'>
            Moderate ({score})
          </Badge>
        );
      return (
        <Badge color='green' variant='light'>
          Low ({score})
        </Badge>
      );
    };
    return (
      <Table.Tr key={item.entity}>
        <Table.Td>
          <Text fw={500} size='sm'>
            {item.entity}
          </Text>
        </Table.Td>
        <Table.Td>{item.totalArticles}</Table.Td>
        <Table.Td>
          <Group gap='xs' wrap='nowrap'>
            <Progress
              value={((item.avgSentiment + 1) / 2) * 100}
              color={item.avgSentiment >= 0 ? 'teal' : 'red'}
              w={60}
              size='sm'
            />
            <Text size='xs' fw={500}>
              {item.avgSentiment}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{getPolarizationBadge(item.polarizationScore)}</Table.Td>
      </Table.Tr>
    );
  });
  return (
    <>
      <Table highlightOnHover verticalSpacing='xs'>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Entity</Table.Th>
            <Table.Th>Articles</Table.Th>
            <Table.Th>Avg Sentiment</Table.Th>
            <Table.Th>Sentiment Variation</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Pagination
        mt='md'
        value={activePage}
        onChange={setActivePage}
        total={Math.ceil(data.length / rowsPerPage)}
      />
    </>
  );
}


export  default EntityPolarizationTable;