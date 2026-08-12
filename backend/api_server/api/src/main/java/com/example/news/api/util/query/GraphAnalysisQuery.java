package com.example.news.api.util.query;

import org.springframework.stereotype.Component;

@Component
public class GraphAnalysisQuery {
    public GraphAnalysisQuery(){}

    public String getPowerCouplesQuery() {
        return """
            MATCH (p:Person)<-[:MENTIONS_PERSON]-(n:News)-[:MENTIONS_ORGANIZATION]->(o:Organization)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN 
                p.name AS person, 
                o.name AS organization, 
                count(n) AS strength, 
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(stDev(n.sentiment), 2) AS volatility
            ORDER BY strength DESC
            LIMIT 50
        """;
    }

    public String getEventTrackerQuery() {
        //Timeline Map View
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)-[:MENTIONS_LOCATION]->(l:Location)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN 
                e.name AS event, 
                l.name AS location, 
                count(n) AS strength,
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(stDev(n.sentiment), 2) AS volatility
            ORDER BY strength DESC
            LIMIT 50
        """;
    }

    public String getGeopoliticalHotspotQuery() {
        // Interactive Map (Choropleth)
        return """
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)-[:COVERS]->(t:Topic)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
            RETURN 
                l.name AS location, 
                t.name AS topic, 
                count(n) AS articleCount, 
                round(avg(n.sentiment), 2) AS avgSentiment
            ORDER BY articleCount DESC
            LIMIT 50
        """;
    }

    public String getNarrativeBridgeQuery() {
        // Dynamic Word Cloud
        return """
            MATCH (p:Person)<-[:MENTIONS_PERSON]-(n:News)-[:TAGGED_WITH]->(kp:`Keyphrase`)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN 
                p.name AS person, 
                kp.name AS keyPhrase, 
                count(n) AS frequency, 
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(stDev(n.sentiment), 2) AS volatility
            ORDER BY frequency DESC
            LIMIT 50
        """;
    }

    public String getPublisherFocusQuery() {
        // Stacked Bar Chart
        return """
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:MENTIONS_ORGANIZATION]->(o:Organization)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN 
                s.name AS publisher, 
                o.name AS organization, 
                count(n) AS coverageVolume,
                round(stDev(n.sentiment), 2) AS volatility
            ORDER BY coverageVolume DESC
            LIMIT 50
        """;
    }

    public String getInfluencerNetworkQuery() {
        // Force-Directed Graph
        return """
            MATCH (p1:Person)<-[:MENTIONS_PERSON]-(n:News)-[:MENTIONS_PERSON]->(p2:Person)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
              AND n.publish_date <= datetime({epochMillis: $endEpoch})
              AND id(p1) < id(p2)
              AND n.sentiment IS NOT NULL
            RETURN 
                p1.name AS personA, 
                p2.name AS personB, 
                count(n) AS sharedArticles,
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(stDev(n.sentiment), 2) AS volatility
            ORDER BY sharedArticles DESC
            LIMIT 50
        """;
    }

    public String getSpatialMapQuery() {
        return """
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
            WITH
                l.latitude AS latitude,
                l.longitude as longitude,
                head(collect(DISTINCT l.name)) AS primaryLocation,
                collect(DISTINCT l.name) AS aliases,
                count(n) AS totalCount,
                sum(n.sentiment) AS totalSentimentSum
            RETURN 
                primaryLocation AS location,
                aliases,
                latitude,
                longitude,
                totalCount AS count,
                round((totalSentimentSum / totalCount), 2) AS avgSentiment
            ORDER BY count DESC
            LIMIT 50
        """;
    }

    public String getAllianceNetworkQuery() {
        //Bipartite Matrix / Interactive Force Graph (similar to the Influencer Network, but filtered for corporate entities).
        return """
            MATCH (o1:Organization)<-[:MENTIONS_ORGANIZATION]-(n:News)-[:MENTIONS_ORGANIZATION]->(o2:Organization)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND id(o1) < id(o2)
            RETURN
                o1.name AS orgA,
                o2.name AS orgB,
                count(n) AS sharedArticles,
                round(avg(n.sentiment), 2) AS avgSentiment
                ORDER BY sharedArticles DESC
            LIMIT 50
        """;
    }

    public String getMediaBiasQuery() {
        //Diverging Bar Chart
        return """
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:COVERS]->(t:Topic)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
            RETURN
                s.name AS source,
                t.name AS topic,
                count(n) AS volume,
                round(avg(n.sentiment), 2) AS avgSentiment
            ORDER BY volume DESC
            LIMIT 50
        """;
    }


    public String getCrisisAndRiskRadarQuery() {
        //Incident Risk Table with Location Badges.
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)-[:MENTIONS_ORGANIZATION]->(o:Organization),
                (n)-[:MENTIONS_LOCATION]->(l:Location)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
            RETURN
                e.name AS event,
                o.name AS organization,
                l.name AS location,
                count(n) AS frequency,
                round(avg(n.sentiment), 2) AS avgSentiment
            ORDER BY frequency DESC
            LIMIT 50
        """;
    }

    public String getTrendingKeywordClusterQuery() {
        //Treemap / Sunburst Chart
        return """
            MATCH (t:Topic)<-[:COVERS]-(n:News)-[:TAGGED_WITH]->(kp:Keyphrase)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
            RETURN
                t.name AS topic,
                kp.name AS keyPhrase,
                count(n) AS coOccurrence,
                round(avg(n.sentiment), 2) AS avgSentiment
            ORDER BY coOccurrence DESC
            LIMIT 50
        """;
    }

    public String getEntitiesGraphQuery() {
        return """
            MATCH (n:News)-[:MENTIONS_PERSON|MENTIONS_ORGANIZATION|MENTIONS_LOCATION|MENTIONS_EVENT]->(e)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
            WITH n, e
            MATCH (n)-[:MENTIONS_PERSON|MENTIONS_ORGANIZATION|MENTIONS_LOCATION|MENTIONS_EVENT]->(other)
            WHERE e <> other
            WITH e, other, count(n) AS weight, avg(n.sentiment) AS sentiment
            WHERE weight >= 1
            RETURN
                coalesce(e.name, e.title) AS source,
                labels(e)[0] AS sourceGroup,
                coalesce(other.name, other.title) AS target,
                labels(other)[0] AS targetGroup,
                weight,
                round(sentiment, 2) AS sentiment
            ORDER BY weight DESC
            LIMIT 300
        """;
    }

    public String getEntityCoOccurrenceMatrixQuery() {
        return """
        MATCH (n:News)-[:MENTIONS_PERSON|MENTIONS_ORGANIZATION]->(e1)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
            AND n.publish_date <= datetime({epochMillis: $endEpoch})
        MATCH (n)-[:MENTIONS_PERSON|MENTIONS_ORGANIZATION]->(e2)
        WHERE e1 <> e2
        WITH e1, e2, count(n) AS sharedCount, round(avg(n.sentiment), 2) AS avgSentiment
        WHERE sharedCount >= 2
        RETURN 
            coalesce(e1['name'], e1['title'], 'Unknown') AS entityA,
            labels(e1)[0] AS typeA,
            coalesce(e2['name'], e2['title'], 'Unknown') AS entityB,
            labels(e2)[0] AS typeB,
            sharedCount,
            avgSentiment
        ORDER BY sharedCount DESC
        LIMIT 100
        """;
    }

    public String getEntityPolarizationQuery() {
        return """
        MATCH (n:News)-[:MENTIONS_PERSON|MENTIONS_ORGANIZATION|MENTIONS_LOCATION]->(e)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
            AND n.publish_date <= datetime({epochMillis: $endEpoch})
          AND n.sentiment IS NOT NULL
        WITH e, count(n) AS totalArticles, avg(n.sentiment) AS avgSentiment, stDev(n.sentiment) AS volatility
        WHERE totalArticles >= 1 AND volatility IS NOT NULL
        RETURN 
            coalesce(e['name'], e['title'], 'Unknown') AS entity,
            labels(e)[0] AS entityGroup,
            totalArticles,
            round(avgSentiment, 2) AS avgSentiment,
            round(volatility, 2) AS polarizationScore
        ORDER BY polarizationScore DESC
        LIMIT 30
        """;
    }

}
