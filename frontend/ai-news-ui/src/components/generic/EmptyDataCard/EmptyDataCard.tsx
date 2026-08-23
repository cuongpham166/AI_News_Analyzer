import { Flex, Text } from '@mantine/core';
import React from 'react';

interface Props {
  title: string;
  description: string;
  height?: number | string;
}
const EmptyDataCard = ({ title, description, height }:Props)=>{
  return (
    <Flex
      h={height}
      align='center'
      justify='center'
      direction='column'
      gap='xs'
    >
      <Text fw={500} c='dimmed'>
        {title}
      </Text>

      <Text size='sm' c='dimmed'>
        {description}
      </Text>
    </Flex>
  );
};

export default EmptyDataCard;