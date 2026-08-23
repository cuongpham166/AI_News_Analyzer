import type { PowerCouple } from '@/shared/types/analysis/network_lab/PowerCouple.ts';
import { NEWS_ENTITY_COLORS } from '@/shared/constants/NewsEntities.ts';

interface NetworkRelationship {
  person: string;
  organization: string;
  strength: number;
  avgSentiment: number;
  volatility: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  category: number;
  entityType: 'person' | 'organization';
  symbolSize: number;
  itemStyle: {
    color: string;
  };
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
  relationship: NetworkRelationship;
  lineStyle: {
    width: number;
    opacity: number;
  };
}
 export const escapeHtml = (value: string) =>
   value
     .replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#039;');

export const getConnectionNetworkData = (data: PowerCouple[], limit = 5) => {
  const relationships = data
    .slice()
    .sort((a, b) => b.strength - a.strength)
    .slice(0, limit);

  const people = [...new Set(relationships.map((d) => d.person))];

  const organizations = [...new Set(relationships.map((d) => d.organization))];

  /*
   * Calculate total connection strength
   * for every node.
   */
  const nodeStrength = new Map<string, number>();

  for (const relationship of relationships) {
    const personId = `person:${relationship.person}`;

    const organizationId = `organization:${relationship.organization}`;

    nodeStrength.set(
      personId,
      (nodeStrength.get(personId) ?? 0) + relationship.strength,
    );

    nodeStrength.set(
      organizationId,
      (nodeStrength.get(organizationId) ?? 0) + relationship.strength,
    );
  }

  const maxNodeStrength = Math.max(...nodeStrength.values(), 1);

  /*
   * Build nodes.
   */
  const nodes: NetworkNode[] = [
    ...people.map((person) => {
      const id = `person:${person}`;

      const normalizedStrength = (nodeStrength.get(id) ?? 0) / maxNodeStrength;

      return {
        id,
        name: person,
        category: 0,
        entityType: 'person',

        /*
         * Node size represents total
         * connection strength.
         */
        symbolSize: 20 + normalizedStrength * 35,

        itemStyle: {
          color: NEWS_ENTITY_COLORS.person,
        },
      };
    }),

    ...organizations.map((organization) => {
      const id = `organization:${organization}`;

      const normalizedStrength = (nodeStrength.get(id) ?? 0) / maxNodeStrength;

      return {
        id,
        name: organization,
        category: 1,
        entityType: 'organization',

        symbolSize: 20 + normalizedStrength * 35,

        itemStyle: {
          color: NEWS_ENTITY_COLORS.organization,
        },
      };
    }),
  ];

  /*
   * Normalize relationship strength
   * for edge width.
   */
  const maxRelationshipStrength = Math.max(
    ...relationships.map((d) => d.strength),
    1,
  );

  /*
   * Build links.
   */
  const links: NetworkLink[] = relationships.map((relationship) => {
    const normalizedStrength = relationship.strength / maxRelationshipStrength;

    return {
      source: `person:${relationship.person}`,

      target: `organization:${relationship.organization}`,

      value: relationship.strength,

      relationship,

      lineStyle: {
        width: 1 + normalizedStrength * 6,

        opacity: 0.65,
      },
    };
  });

  return {
    people,
    organizations,
    relationships,
    nodes,
    links,
  };
};

export const buildTooltipChart = (params) => {
  if (params.dataType === 'node') {
    const node = params.data as NetworkNode;

    const type = node.category === 0 ? 'Person' : 'Organization';

    return `
              <div style="
                min-width: 180px;
                line-height: 1.5;
              ">
                <div style="
                  font-weight: 600;
                  margin-bottom: 3px;
                ">
                  ${escapeHtml(node.name)}
                </div>

                <div style="
                  color: #6B7280;
                ">
                  ${type}
                </div>
              </div>
            `;
  }

  if (params.dataType === 'edge') {
    const link = params.data as NetworkLink;

    const relationship = link.relationship;

    return `
              <div style="
                min-width: 240px;
                line-height: 1.5;
              ">
                <div style="
                  font-weight: 600;
                  margin-bottom: 4px;
                ">
                  ${escapeHtml(relationship.person)}
                </div>

                <div style="
                  color: #6B7280;
                  margin-bottom: 10px;
                ">
                  ${escapeHtml(relationship.organization)}
                </div>

                <div style="
                  border-top: 1px solid #E5E7EB;
                  padding-top: 8px;
                ">
                  <div style="
                    display: flex;
                    justify-content:
                      space-between;
                    gap: 24px;
                  ">
                    <span>Strength</span>

                    <strong>
                      ${relationship.strength}
                    </strong>
                  </div>

                  <div style="
                    display: flex;
                    justify-content:
                      space-between;
                    gap: 24px;
                  ">
                    <span>
                      Joint sentiment
                    </span>

                    <strong>
                      ${relationship.avgSentiment}
                    </strong>
                  </div>

                  <div style="
                    display: flex;
                    justify-content:
                      space-between;
                    gap: 24px;
                  ">
                    <span>Volatility</span>

                    <strong>
                      ${relationship.volatility}
                    </strong>
                  </div>
                </div>
              </div>
            `;
  }

  return '';
}