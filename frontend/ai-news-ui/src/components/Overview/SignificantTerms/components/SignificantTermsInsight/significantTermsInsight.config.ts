export const GRID = {
  left: 70,
  right: 40,
  top: 70,
  bottom: 60,
};

export const ZOOM = [
  {
    type: 'inside',
    xAxisIndex: 0,
    filterMode: 'empty',
  },
  {
    type: 'inside',
    yAxisIndex: 0,
    filterMode: 'empty',
  },
];


export const SECTION_CONFIG = {
  title: 'Significance Matrix',
  description:
    'Compare terms by statistical significance and mention frequency to identify trending and emerging topics.',
  control_options: [
    { label: 'All', value: 'all' },
    { label: 'Person', value: 'person' },
    { label: 'Organization ', value: 'organization' },
    { label: 'Location ', value: 'location' },
    { label: 'Event ', value: 'event' },
  ],
};