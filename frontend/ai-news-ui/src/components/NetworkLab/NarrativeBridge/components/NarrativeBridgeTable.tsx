import type { NarrativeBridge } from '@/shared/types/analysis/network_lab/NarrativeBridge.ts';
import {
  getSentimentBadge,
  getVolatilityBadge,
} from './narrativeBridgeTable.utils.tsx';
import {
  Accordion,
  Badge,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Pagination,
  Box,
} from '@mantine/core';
import React, { useMemo, useState } from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface NarrativeBridgeProps {
  narrativeBridge?: NarrativeBridge[];
}
const NarrativeBridgeTable = ({
  narrativeBridge,
}: NarrativeBridgeProps) => {
  const hasData = narrativeBridge && narrativeBridge.length > 0
  const ITEMS_PER_PAGE = 8;
  const [activePage, setActivePage] = useState(1);
  const [search, setSearch] = useState('');

  const groupedData = useMemo(() => {
    if(!hasData) {
      return []
    }
    const map = new Map<string, NarrativeBridge[]>();
    for (const item of narrativeBridge) {
      if (!map.has(item.person)) {
        map.set(item.person, []);
      }
      map.get(item.person)!.push(item);
    }
    return map;
  }, [hasData, narrativeBridge]);

  const filteredPeople = useMemo(() => {
    if (!hasData) {
      return [];
    }
    const entries = Array.from(groupedData.entries());
    if (!search.trim()) return entries;

    const query = search.toLowerCase();
    return entries.filter(([person, phrases]) => {
      const matchesPerson = person.toLowerCase().includes(query);
      const matchesPhrase = phrases.some((p) =>
        p.keyPhrase.toLowerCase().includes(query),
      );
      return matchesPerson || matchesPhrase;
    });
  }, [groupedData, hasData, search]);

  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);
  const paginatedPeople = useMemo(() => {
    const start = (activePage - 1) * ITEMS_PER_PAGE;
    return filteredPeople.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPeople, activePage]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setActivePage(1);
  };

  return (
    <>
      {hasData ? (
        <Stack>
          <Box style={{ flex: 1, minHeight: 0 }}>
            {paginatedPeople.length > 0 ? (
              <Accordion variant='separated' radius='md'>
                {paginatedPeople.map(([person, phrases]) => (
                  <Accordion.Item key={person} value={person}>
                    <Accordion.Control>
                      <Group justify='space-between' pr='md'>
                        <Text fw={600} size='sm'>
                          {person}
                        </Text>
                        <Badge variant='light' color='gray' size='sm'>
                          {phrases.length}{' '}
                          {phrases.length === 1 ? 'phrase' : 'phrases'}
                        </Badge>
                      </Group>
                    </Accordion.Control>

                    <Accordion.Panel>
                      <Table
                        verticalSpacing='xs'
                        horizontalSpacing='xs'
                        highlightOnHover
                      >
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Associated Key Phrase</Table.Th>
                            <Table.Th ta='center'>Freq</Table.Th>
                            <Table.Th ta='center'>Sentiment</Table.Th>
                            <Table.Th ta='center'>Volatility</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {phrases.map((row, idx) => (
                            <Table.Tr key={`${person}-${row.keyPhrase}-${idx}`}>
                              <Table.Td fw={500}>
                                <Text size='xs' fw={600}>
                                  {row.keyPhrase}
                                </Text>
                              </Table.Td>
                              <Table.Td ta='center'>
                                <Text size='xs' fw={600}>
                                  {row.frequency}
                                </Text>
                              </Table.Td>
                              <Table.Td ta='center'>
                                {getSentimentBadge(row.avgSentiment)}
                              </Table.Td>
                              <Table.Td ta='center'>
                                {getVolatilityBadge(row.volatility)}
                              </Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            ) : (
              <Text size='sm' c='dimmed' ta='center' py='xl'>
                No narrative bridges match your query.
              </Text>
            )}
          </Box>
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
        <EmptyDataCard
          title='No data available'
          description='No narrative bridge data were found.'
        />
      )}
    </>
  );
};

export default  NarrativeBridgeTable;