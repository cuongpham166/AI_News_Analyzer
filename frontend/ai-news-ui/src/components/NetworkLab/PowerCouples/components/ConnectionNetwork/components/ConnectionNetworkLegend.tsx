import { ColorSwatch, Group, Text, Box } from '@mantine/core';
import {
  NEWS_ENTITY_COLORS,
  NEWS_ENTITIES,
} from '@/shared/constants/NewsEntities.ts';


const ConnectionNetworkLegend = () => {
  const entityTypes = NEWS_ENTITIES.filter(
    (item): item is 'person' | 'organization' =>
      item === 'person' || item === 'organization',
  );

  return (
    <Group gap='md'>
      {entityTypes.map((type) => (
        <Group key={type} gap={6} wrap='nowrap'>
          <ColorSwatch color={NEWS_ENTITY_COLORS[type]} size={10} />
          <Text size='sm'>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        </Group>
      ))}
    </Group>
  );
};

export default ConnectionNetworkLegend;
