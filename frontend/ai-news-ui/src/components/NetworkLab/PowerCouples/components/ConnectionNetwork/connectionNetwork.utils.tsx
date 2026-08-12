import type { PowerCouple } from '@/shared/types/analysis/PowerCouple.ts';

export const getConnectionNetworkData = (data: PowerCouple[]) => {
  const people = [...new Set(data.map((d)=>d.person))];
  const organizations = [...new Set(data.map((d) => d.organization))];
  const nodes = [
    ...people.map((person) => ({
      id: `person:${person}`,
      name: person,
      category: 0,
    })),
    ...organizations.map((organization) => ({
      id: `org:${organization}`,
      name: organization,
      category: 1,
    })),
  ];

  const links = data.map((d) => ({
    source: `person:${d.person}`,
    target: `org:${d.organization}`,
    value: d.strength,
    lineStyle: {
      width: Math.max(1, d.strength * 3),
    },
  }));

  return {people, organizations, links, nodes};
};
