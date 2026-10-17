import {
  Table,
  Badge,
  Progress,
  Group,
  Text,
  Pagination,
  Flex,
  Tooltip,
} from '@mantine/core';
import type {EntityPolarizationType} from '@/shared/interfaces/analysis/EntityNetworkLab/EntityPolarizationType.ts';
import React, { useState } from 'react';
import DashboardSection from '@/components/generic/DashboardSection';
import type { EntityPolarizationSentiment } from '@/shared/types/analysis';
import EmptyDataCard from '@/components/generic/EmptyDataCard';

interface EntityPolarizationTableProps {
  entityPolarization?: EntityPolarizationSentiment[];
}

function compare(
  a: EntityPolarizationSentiment,
  b: EntityPolarizationSentiment,
) {
  if (b.totalArticles !== a.totalArticles) {
    return b.totalArticles - a.totalArticles;
  }
  return b.polarizationScore - a.polarizationScore;
}

export const EntityPolarizationTable = ({
  entityPolarization,
}: EntityPolarizationTableProps) => {
  const [activePage, setActivePage] = useState(1);

  const hasData = Boolean(entityPolarization && entityPolarization.length > 0);

  // 1. Handle empty / undefined data safely
  if (!hasData || !entityPolarization) {
    return (
      <DashboardSection
        title='Entity Metrics'
        description='Compare entities side by side using article volume, average sentiment, and polarization score for a detailed view of their coverage.'
      >
        <EmptyDataCard
          title='No data available'
          description='No entity polarization data were found.'
        />
      </DashboardSection>
    );
  }

  // 2. Safely sort a shallow copy of the array (avoids mutating props)
  const sortedData = [...entityPolarization].sort(compare);

  const rowsPerPage = 13;
  const paginatedData = sortedData.slice(
    (activePage - 1) * rowsPerPage,
    activePage * rowsPerPage,
  );

  // 3. Polarization Badge thresholds for Option 1 (Scaled stDev: 0.00 to 1.00)
  const getPolarizationBadge = (score: number) => {
    const formattedScore = score.toFixed(2);
    if (score >= 0.6) {
      return (
        <Badge color='red' variant='light'>
          High ({formattedScore})
        </Badge>
      );
    }
    if (score >= 0.35) {
      return (
        <Badge color='yellow' variant='light'>
          Moderate ({formattedScore})
        </Badge>
      );
    }
    return (
      <Badge color='green' variant='light'>
        Low ({formattedScore})
      </Badge>
    );
  };

  const rows = paginatedData.map((item) => {
    const formattedAvgSentiment =
      item.avgSentiment > 0
        ? `+${item.avgSentiment.toFixed(2)}`
        : item.avgSentiment.toFixed(2);

    return (
      <Table.Tr key={item.entity}>
        {/* Entity Name */}
        <Table.Td>
          <Text fw={500} size='sm'>
            {item.entity}
          </Text>
          {item.entityGroup && (
            <Text size='xs' c='dimmed'>
              {item.entityGroup}
            </Text>
          )}
        </Table.Td>

        {/* Article Volume & Pos/Neg breakdown */}
        <Table.Td>
          {item.positiveCount !== undefined &&
          item.negativeCount !== undefined ? (
            <Tooltip
              label={`${item.positiveCount} Positive / ${item.negativeCount} Negative`}
            >
              <div>
                <Text size='sm' fw={500}>
                  {item.totalArticles}
                </Text>
                <Text size='xs' c='dimmed'>
                  {item.positiveCount} pos · {item.negativeCount} neg
                </Text>
              </div>
            </Tooltip>
          ) : (
            <Text size='sm' fw={500}>
              {item.totalArticles}
            </Text>
          )}
        </Table.Td>

        {/* Average Sentiment Bar */}
        <Table.Td>
          <Group gap='xs' wrap='nowrap'>
            <Progress
              value={((item.avgSentiment + 1) / 2) * 100}
              color={item.avgSentiment >= 0 ? 'teal' : 'red'}
              w={60}
              size='sm'
            />
            <Text size='xs' fw={500}>
              {formattedAvgSentiment}
            </Text>
          </Group>
        </Table.Td>

        {/* Option 1 Polarization Badge */}
        <Table.Td>{getPolarizationBadge(item.polarizationScore)}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <DashboardSection
      title='Entity Metrics'
      description='Compare entities side by side using article volume, average sentiment, and polarization score for a detailed view of their coverage.'
    >
      <Flex direction='column' h='100%'>
        <Table highlightOnHover verticalSpacing='xs'>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Entity</Table.Th>
              <Table.Th>Articles</Table.Th>
              <Table.Th>Avg Sentiment</Table.Th>
              <Table.Th>Polarization Score</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Pagination
          mt='md'
          value={activePage}
          onChange={setActivePage}
          total={Math.ceil(sortedData.length / rowsPerPage)}
        />
      </Flex>
    </DashboardSection>
  );
};


export  default EntityPolarizationTable;