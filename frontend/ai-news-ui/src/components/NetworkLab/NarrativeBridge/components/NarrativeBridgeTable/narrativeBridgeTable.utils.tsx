import { Badge } from '@mantine/core';

export const getSentimentBadge = (val: number) => {
  if (val >= 0.5)
    return (
      <Badge color='green' variant='light'>
        +{val.toFixed(2)}
      </Badge>
    );

  if (val <= -0.5)
    return (
      <Badge color='red' variant='light'>
        {val.toFixed(2)}
      </Badge>
    );

  return (
    <Badge color='gray' variant='light'>
      {val.toFixed(2)}
    </Badge>
  );
};

export const getVolatilityBadge = (val: number) => {
  if (val > 0.3)
    return (
      <Badge color='red' variant='dot'>
        High ({val.toFixed(2)})
      </Badge>
    );
  if (val > 0.1)
    return (
      <Badge color='yellow' variant='dot'>
        Med ({val.toFixed(2)})
      </Badge>
    );
  return (
    <Badge color='blue' variant='dot'>
      Low ({val.toFixed(2)})
    </Badge>
  );
};