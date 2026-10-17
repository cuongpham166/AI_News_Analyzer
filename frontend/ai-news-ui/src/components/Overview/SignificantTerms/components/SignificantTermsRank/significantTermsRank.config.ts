export const GRID = {
  left: 150,
  right: 30,
  top: 20,
  bottom: 20,
};

export const GRAPHIC_DATA = {
  type: 'text',
  left: 'center',
  top: 'middle',
  style: {
    text: 'No significant terms found',
    fill: '#999',
    fontSize: 16,
    fontWeight: 500,
  },
};

export const SECTION_CONFIG = {
  title: 'Top Significant Terms',
  description: 'Compare terms ranked by their overall importance.',
  control_options: [
    { label: 'All', value: 'all' },
    { label: 'Person', value: 'person' },
    { label: 'Organization ', value: 'organization' },
    { label: 'Location ', value: 'location' },
    { label: 'Event ', value: 'event' },
  ],
};