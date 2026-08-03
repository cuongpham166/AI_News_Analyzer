import type { GlobalEntitiesTrendsType } from '@/shared/interfaces/analysis/ExecutiveOverview/GlobalEntitiesTrendsType.ts';

interface EntitiesHeatmapData {
  date: string;
  entity: string;
  mentions: number;
  sentiment: number;
}

export const getTopHeatmapEntities = (
  data: GlobalEntitiesTrendsType,
  limit = 20,
) => {
  const entityCounts = new Map<string, number>();

  Object.values(data.timeline).forEach((entities) => {
    entities.forEach((item) => {
      entityCounts.set(
        item.name,
        (entityCounts.get(item.name) ?? 0) + item.count,
      );
    });
  });

  return [...entityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
};

export const getEntitiesHeatmapData = (data: GlobalEntitiesTrendsType, limit = 20) => {
  const dates = Object.keys(data.timeline);

  const topEntities = getTopHeatmapEntities(data, limit);

  const lookup = new Map(
    Object.entries(data.timeline).flatMap(([date, entities]) =>
      entities.map((item) => [`${date}_${item.name}`, item]),
    ),
  );

  const heatmapData = [];

  dates.forEach((date, xIndex) => {
    topEntities.forEach((entity, yIndex) => {
      const item = lookup.get(`${date}_${entity}`);

      heatmapData.push([
        xIndex,
        yIndex,
        item?.count ?? 0,
        item?.averageSentiment ?? null,
      ]);
    });
  });

  return {
    dates,
    entities: topEntities,
    data: heatmapData,
  };
};



/*[
  {
    entity: "António Guterres",
    date: "2026-07-01",
    count: 9
  },
  {
    entity: "UNICEF",
    date: "2026-06-01",
    count: 3
  }
]*/

/*X axis: date, Y axis: entity, color value: count*/
