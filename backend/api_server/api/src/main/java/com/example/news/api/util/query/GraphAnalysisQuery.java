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

    public String getEventTrackerQueryNew() {
        //Timeline Map View
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)-[:MENTIONS_LOCATION]->(l:Location)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
            RETURN
                e.name AS event,
                l.name AS location,
                count(n) AS strength,
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(stDev(n.sentiment), 2) AS volatility,
                l.countryCode AS countryCode,
                l.country AS country,
                l.latitude AS latitude,
                l.longitude AS longitude,
                collect(DISTINCT l.name) AS aliases
            ORDER BY strength DESC
            LIMIT 50
        """;
    }

    public String getEventTrackerMetricsQuery() {
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN
               count(DISTINCT e) AS eventsTracked,
               count(DISTINCT n) AS totalEventCoverage,
               round(avg(n.sentiment), 2) AS avgSentiment
        """;
    }

    public String getGeopoliticalHotspotQuery() {
        return """
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)-[:COVERS]->(t:Topic)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
            WITH
                l.name AS location,
                t.name AS topic,
                count(DISTINCT n) AS articleCount,
                round(avg(n.sentiment), 2) AS avgSentiment,
                l.latitude AS latitude,
                l.longitude as longitude,
                head(collect(DISTINCT l.name)) AS primaryLocation,
                collect(DISTINCT l.name) AS aliases,
                l.country AS country,
                l.countryCode AS countryCode
            RETURN
                location,
                topic,
                articleCount,
                avgSentiment,
                latitude,
                longitude,
                primaryLocation,
                aliases,
                country,
                countryCode
            ORDER BY articleCount DESC
            LIMIT 50
        """;
    }

    public String getGeopoliticalMetricsQuery() {
        return """
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
                AND EXISTS {
                    MATCH (n)-[:COVERS]->(:Topic)
                }
    
            WITH
                collect(DISTINCT n) AS articles,
                count(DISTINCT l) AS hotspots,
                count(DISTINCT l.countryCode) AS countries
    
            RETURN
                size(articles) AS totalArticles,
                hotspots,
                countries,
                CASE
                    WHEN size(articles) = 0 THEN 0.0
                    ELSE round(
                         reduce(
                                total = 0.0,
                                article IN articles |
                                total + coalesce(article.sentiment, 0.0)
                         ) / size(articles),
                         2
                    )
                END AS avgSentiment
        """;
    }

    public String getGeopoliticalHotspotQueryNew() {
        return """
        MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
            AND n.publish_date <= datetime({epochMillis: $endEpoch})
            AND l.latitude <> 0.0
            AND l.longitude <> 0.0
            AND EXISTS {
                MATCH (n)-[:COVERS]->(:Topic)
            }

        WITH
            l.countryCode AS countryCode,
            l.country AS country,
            l.latitude AS latitude,
            l.longitude AS longitude,
            collect(DISTINCT l.name) AS aliases,
            collect(DISTINCT n) AS articles

        WITH
            countryCode,
            country,
            latitude,
            longitude,
            aliases,
            articles,
            size(articles) AS articleCount

        UNWIND articles AS article
        MATCH (article)-[:COVERS]->(t:Topic)

        WITH
            countryCode,
            country,
            latitude,
            longitude,
            aliases,
            articles,
            articleCount,
            t.name AS topic,
            count(DISTINCT article) AS topicArticleCount

        ORDER BY topicArticleCount DESC

        WITH
            countryCode,
            country,
            latitude,
            longitude,
            aliases,
            articles,
            articleCount,
            collect({
                name: topic,
                articleCount: topicArticleCount
            }) AS topics

        RETURN
            head(aliases) AS location,
            articleCount,
            round(
                reduce(
                    total = 0.0,
                    article IN articles |
                    total + coalesce(article.sentiment, 0.0)
                ) / CASE
                    WHEN articleCount = 0 THEN 1.0
                    ELSE articleCount
                END,
                2
            ) AS avgSentiment,
            topics,
            aliases,
            latitude,
            longitude,
            country,
            countryCode

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
                sum(n.sentiment) AS totalSentimentSum,
                l.country AS country,
                l.countryCode AS countryCode
            RETURN 
                primaryLocation AS location,
                aliases,
                latitude,
                longitude,
                totalCount AS count,
                round((totalSentimentSum / totalCount), 2) AS avgSentiment,
                country,
                countryCode
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
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
            OPTIONAL MATCH (n)-[:MENTIONS_ORGANIZATION]->(o:Organization)
            OPTIONAL MATCH (n)-[:MENTIONS_LOCATION]->(l:Location)
            RETURN
                e.name AS event,
                collect(DISTINCT o.name) AS organizations,
                collect(DISTINCT l.name) AS locations,
                count(DISTINCT n) AS frequency,
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(stDev(n.sentiment), 2) AS volatility
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

    public String getCountryRiskQuery() {
        return """
        CALL {
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
                AND l.country <> 'Unknown'
                AND l.countryCode <> 'xx'

            RETURN count(DISTINCT n) AS totalArticles
        }

        MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
            AND n.publish_date <= datetime({epochMillis: $endEpoch})
            AND l.latitude <> 0.0
            AND l.longitude <> 0.0
            AND l.country <> 'Unknown'
            AND l.countryCode <> 'xx'

        WITH
            l.countryCode AS countryCode,
            head(collect(DISTINCT l.country)) AS country,
            collect(DISTINCT n) AS articles,
            totalArticles

        WITH
            countryCode,
            country,
            articles,
            size(articles) AS articleCount,
            totalArticles

        RETURN
            country,
            countryCode,
            articleCount,

            CASE
                WHEN articleCount = 0 THEN 0.0
                ELSE round(
                    reduce(
                        total = 0.0,
                        article IN articles |
                        total + coalesce(article.sentiment, 0.0)
                    ) / articleCount,
                    2
                )
            END AS avgSentiment,

            CASE
                WHEN totalArticles = 0 THEN 0.0
                ELSE round(
                    toFloat(articleCount) / totalArticles * 100,
                    2
                )
            END AS coveragePercent

        ORDER BY articleCount DESC
    """;
    }


    public String getEventRiskRadarQuery() {
        return """
        MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
          AND n.publish_date <= datetime({epochMillis: $endEpoch})
          AND n.sentiment IS NOT NULL
        RETURN
            e.name AS event,
            count(n) AS frequency,
            round(avg(n.sentiment), 2) AS avgSentiment,
            round(coalesce(stDev(n.sentiment), 0.0), 2) AS volatility
        ORDER BY frequency DESC
        LIMIT 50
    """;
    }

    public String getEventMomentumQuery() {
        return """
        MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
          AND n.publish_date <= datetime({epochMillis: $endEpoch})
        WITH e, date(n.publish_date) AS publishDate, count(n) AS dailyVolume
        RETURN
            e.name AS event,
            collect({date: toString(publishDate), volume: dailyVolume}) AS timeline,
            sum(dailyVolume) AS totalVolume
        ORDER BY totalVolume DESC
        LIMIT 10
    """;
    }

}
