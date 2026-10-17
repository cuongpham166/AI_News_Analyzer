package com.example.news.api.util.query.graph;

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
                sum(CASE WHEN n.sentiment > 0 THEN 1 ELSE 0 END) AS positiveCoOccurrences,
                sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END) AS negativeCoOccurrences,
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(stDev(n.sentiment), 2) AS volatility
            ORDER BY strength DESC
            LIMIT 50
        """;
    }

    public String getEventTrackerQueryNew() {
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)-[:MENTIONS_LOCATION]->(l:Location)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
                AND l.latitude IS NOT NULL
                AND l.longitude IS NOT NULL
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
            WITH e, l, n,
                CASE WHEN n.sentiment >= 0.0 THEN 1 ELSE 0 END AS isPos,
                CASE WHEN n.sentiment < 0.0 THEN 1 ELSE 0 END AS isNeg
            WITH e.name AS event,
                l.name AS location,
                collect(DISTINCT l.name) AS aliases,
                count(n) AS frequency,
                sum(isPos) AS positiveVolume,
                sum(isNeg) AS negativeVolume,
                round(avg(n.sentiment), 2) AS avgSentiment,
                CASE
                    WHEN count(n) > 1 THEN coalesce(round(stDev(n.sentiment), 2), 0.0)
                    ELSE 0.0
                END AS volatility,
                head(collect(DISTINCT l.countryCode)) AS countryCode,
                head(collect(DISTINCT l.country)) AS country,
                l.latitude AS latitude,
                l.longitude AS longitude
            RETURN
                event,
                location,
                aliases,
                frequency,
                positiveVolume,
                negativeVolume,
                avgSentiment,
                volatility,
                round(toFloat(negativeVolume) / frequency, 2) AS riskScore,
                countryCode,
                country,
                latitude,
                longitude
            ORDER BY frequency DESC
            LIMIT 100
        """;
    }

    public String getEventTrackerMetricsQuery() {
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)-[:MENTIONS_LOCATION]->(l:Location)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
                AND l.latitude IS NOT NULL
                AND l.longitude IS NOT NULL
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
            WITH e,
                count(DISTINCT n) AS eventFreq,
                sum(CASE WHEN n.sentiment >= 0.0 THEN 1 ELSE 0 END) AS eventPos,
                sum(CASE WHEN n.sentiment < 0.0 THEN 1 ELSE 0 END) AS eventNeg,
                avg(n.sentiment) AS eventAvgSent,
                CASE
                    WHEN count(DISTINCT n) > 1 THEN coalesce(stDev(n.sentiment), 0.0)
                    ELSE 0.0
                END AS eventVolat
            WITH e, eventFreq, eventPos, eventNeg, eventAvgSent, eventVolat,
                 CASE
                    WHEN eventFreq > 0 THEN toFloat(eventNeg) / eventFreq
                    ELSE 0.0
                 END AS eventRisk
            RETURN
                count(DISTINCT e) AS eventsTracked,
                sum(eventFreq) AS totalMentions,
                sum(eventPos) AS positiveVolume,
                sum(eventNeg) AS negativeVolume,
                round(avg(eventAvgSent), 2) AS avgSentiment,
                round(avg(eventVolat), 2) AS avgVolatility,
                sum(CASE WHEN eventRisk >= 0.5 THEN 1 ELSE 0 END) AS highRiskEvents
        """;
    }


    public String getGeopoliticalMetricsQuery() {
        return """
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
                AND l.country <> 'UNKNOWN'
                AND l.countryCode <> 'XX'
                AND n.sentiment IS NOT NULL
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
                END AS avgSentiment,
                CASE
                    WHEN size(articles) = 0 THEN 0.0
                    ELSE round(
                         toFloat(
                            reduce(
                                negCount = 0,
                                article IN articles |
                                negCount + CASE WHEN article.sentiment < 0 THEN 1 ELSE 0 END
                            )
                         ) / size(articles),
                         2
                    )
                END AS avgRiskScore
        """;
    }

    public String getGeopoliticalHotspotQueryNew() {
        return """
        MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
            AND n.publish_date <= datetime({epochMillis: $endEpoch})
            AND l.latitude <> 0.0
            AND l.longitude <> 0.0
            AND l.country <> 'UNKNOWN'
            AND l.countryCode <> 'XX'
            AND n.sentiment IS NOT NULL
            AND EXISTS { MATCH (n)-[:COVERS]->(:Topic) }

        OPTIONAL MATCH (n)-[:COVERS]->(t:Topic)
        WITH l, n, t
        WITH l, t.name AS topicName, count(DISTINCT n) AS topicArticleCount
        WHERE topicName IS NOT NULL
        ORDER BY topicArticleCount DESC

        WITH l, collect({name: topicName, articleCount: topicArticleCount}) AS topics

        MATCH (l)<-[:MENTIONS_LOCATION]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
            AND n.publish_date <= datetime({epochMillis: $endEpoch})
            AND n.sentiment IS NOT NULL
            AND EXISTS { MATCH (n)-[:COVERS]->(:Topic) }

        RETURN
            l.name AS location,
            count(DISTINCT n) AS articleCount,
            round(avg(n.sentiment), 2) AS avgSentiment,
            round(
                toFloat(sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END)) / count(DISTINCT n),
                2
            ) AS riskScore,
            topics,
            collect(DISTINCT l.name) AS aliases,
            l.latitude AS latitude,
            l.longitude AS longitude,
            l.country AS country,
            l.countryCode AS countryCode
        ORDER BY articleCount DESC
        LIMIT 100
    """;
    }

    public String getNarrativeBridgeQuery() {
        return """
            MATCH (p:Person)<-[:MENTIONS_PERSON]-(n:News)-[:TAGGED_WITH]->(kp:`Keyphrase`)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch}) 
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            WITH p, kp, n,
                CASE WHEN n.sentiment >= 0.0 THEN 1 ELSE 0 END AS isPos,
                CASE WHEN n.sentiment < 0.0 THEN 1 ELSE 0 END AS isNeg
            WITH p, kp,
                count(n) AS frequency,
                sum(isPos) AS positiveVolume,
                sum(isNeg) AS negativeVolume,
                round(avg(n.sentiment), 2) AS avgSentiment,
                round(coalesce(stDev(n.sentiment), 0.0), 2) AS volatility
            RETURN 
                p.name AS person, 
                kp.name AS keyPhrase, 
                frequency,
                positiveVolume,
                negativeVolume,
                avgSentiment,
                volatility,
                round(abs(toFloat(positiveVolume - negativeVolume) / frequency), 2) AS stabilityScore
            ORDER BY frequency DESC
            LIMIT 50
        """;
    }

    public String getPublisherFocusQuery() {
        return """
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:MENTIONS_ORGANIZATION]->(o:Organization)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN
                s.name AS publisher,
                o.name AS organization,
                count(n) AS coverageVolume,
                round(avg(n.sentiment), 2) AS avgSentiment,
                sum(CASE WHEN n.sentiment >= 0.0 THEN 1 ELSE 0 END) AS positiveVolume,
                sum(CASE WHEN n.sentiment < 0.0 THEN 1 ELSE 0 END) AS negativeVolume
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
                AND n.sentiment IS NOT NULL
                AND l.latitude <> 0.0
                AND l.longitude <> 0.0
            WITH l, n,
                CASE WHEN n.sentiment >= 0.0 THEN 1 ELSE 0 END AS isPos,
                CASE WHEN n.sentiment < 0.0 THEN 1 ELSE 0 END AS isNeg
            WITH l.latitude AS latitude,
                l.longitude AS longitude,
                head(collect(DISTINCT l.name)) AS location,
                collect(DISTINCT l.name) AS aliases,
                count(n) AS frequency,
                sum(isPos) AS positiveVolume,
                sum(isNeg) AS negativeVolume,
                round(avg(n.sentiment), 2) AS avgSentiment,
                head(collect(DISTINCT l.country)) AS country,
                head(collect(DISTINCT l.countryCode)) AS countryCode
            RETURN
                location,
                aliases,
                latitude,
                longitude,
                frequency,
                positiveVolume,
                negativeVolume,
                avgSentiment,
                round(toFloat(negativeVolume) / frequency, 2) AS riskScore,
                country,
                countryCode
            ORDER BY frequency DESC
        """;
    }

    public String getAllianceNetworkQuery() {
        return """
            MATCH (o1:Organization)<-[:MENTIONS_ORGANIZATION]-(n:News)-[:MENTIONS_ORGANIZATION]->(o2:Organization)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND id(o1) < id(o2)
                AND n.sentiment IS NOT NULL
            RETURN
                o1.name AS orgA,
                o2.name AS orgB,
                count(n) AS sharedArticles,
                sum(CASE WHEN n.sentiment > 0 THEN 1 ELSE 0 END) AS positiveArticles,
                sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END) AS conflictArticles,
                round(avg(n.sentiment), 2) AS avgSentiment
            ORDER BY sharedArticles DESC
            LIMIT 50
        """;
    }

    public String getMediaBiasQuery() {
        return """
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:COVERS]->(t:Topic)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN
                s.name AS source,
                t.name AS topic,
                count(n) AS volume,
                sum(CASE WHEN n.sentiment > 0 THEN 1 ELSE 0 END) AS positiveVolume,
                sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END) AS negativeVolume,
                round(avg(n.sentiment), 2) AS avgSentiment
            ORDER BY volume DESC
            LIMIT 50
        """;
    }


    public String getCrisisAndRiskRadarQuery() {
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment < 0
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
        return """
            MATCH (t:Topic)<-[:COVERS]-(n:News)-[:TAGGED_WITH]->(kp:Keyphrase)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
            RETURN
                t.name AS topic,
                kp.name AS keyPhrase,
                count(n) AS coOccurrence,
                sum(CASE WHEN n.sentiment > 0 THEN 1 ELSE 0 END) AS positiveCoOccurrence,
                sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END) AS negativeCoOccurrence,
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
            WITH e, other,
                count(n) AS weight,
                avg(n.sentiment) AS sentiment,
                sum(CASE WHEN n.sentiment > 0 THEN 1 ELSE 0 END) AS positiveWeight,
                sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END) AS negativeWeight
            WHERE weight >= 1
            RETURN
                coalesce(e.name, e.title) AS source,
                labels(e)[0] AS sourceGroup,
                coalesce(other.name, other.title) AS target,
                labels(other)[0] AS targetGroup,
                weight,
                positiveWeight,
                negativeWeight,
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
            WITH e,
                count(n) AS totalArticles,
                avg(n.sentiment) AS avgSentiment,
                stDev(n.sentiment) AS volatility,
                sum(CASE WHEN n.sentiment > 0 THEN 1 ELSE 0 END) AS positiveCount,
                sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END) AS negativeCount
            WHERE totalArticles >= 2 AND volatility IS NOT NULL
            RETURN
                coalesce(e['name'], e['title'], 'Unknown') AS entity,
                labels(e)[0] AS entityGroup,
                totalArticles,
                positiveCount,
                negativeCount,
                round(avgSentiment, 2) AS avgSentiment,
                round(volatility / 1.4142, 2) AS polarizationScore
            ORDER BY polarizationScore DESC, totalArticles DESC
            LIMIT 30
            """;
    }

    public String getCountryRiskQuery() {
        return """
        CALL {
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND n.sentiment IS NOT NULL
                AND l.country IS NOT NULL
                AND toUpper(l.country) <> 'UNKNOWN'
                AND l.countryCode IS NOT NULL
                AND toUpper(l.countryCode) <> 'XX'

            RETURN count(DISTINCT n) AS totalGlobalArticles
        }

        MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
            AND n.publish_date <= datetime({epochMillis: $endEpoch})
            AND n.sentiment IS NOT NULL
            AND l.country IS NOT NULL
            AND toUpper(l.country) <> 'UNKNOWN'
            AND l.countryCode IS NOT NULL
            AND toUpper(l.countryCode) <> 'XX'

        WITH l.countryCode AS countryCode,
            head(collect(DISTINCT l.country)) AS country,
            count(DISTINCT n) AS frequency,
            sum(CASE WHEN n.sentiment >= 0.0 THEN 1 ELSE 0 END) AS positiveVolume,
            sum(CASE WHEN n.sentiment < 0.0 THEN 1 ELSE 0 END) AS negativeVolume,
            round(avg(n.sentiment), 2) AS avgSentiment,
            totalGlobalArticles

        RETURN
            country,
            countryCode,
            frequency,
            positiveVolume,
            negativeVolume,
            avgSentiment,
            round(toFloat(negativeVolume) / frequency, 2) AS riskScore,
            CASE
                WHEN totalGlobalArticles = 0 THEN 0.0
                ELSE round((toFloat(frequency) / totalGlobalArticles) * 100, 2)
            END AS coveragePercent

        ORDER BY frequency DESC
    """;
    }


    public String getEventRiskRadarQuery() {
        return """
        MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
          AND n.publish_date <= datetime({epochMillis: $endEpoch})
          AND n.sentiment IS NOT NULL
        WITH e, n,
            CASE WHEN n.sentiment >= 0.0 THEN 1 ELSE 0 END AS isPos,
            CASE WHEN n.sentiment < 0.0 THEN 1 ELSE 0 END AS isNeg
        WITH e,
            count(n) AS frequency,
            sum(isPos) AS positiveVolume,
            sum(isNeg) AS negativeVolume,
            round(avg(n.sentiment), 2) AS avgSentiment,
            round(coalesce(stDev(n.sentiment), 0.0), 2) AS volatility
        RETURN
            e.name AS event,
            frequency,
            positiveVolume,
            negativeVolume,
            avgSentiment,
            volatility,
            round(toFloat(negativeVolume) / frequency, 2) AS riskScore,
            round(1.0 - abs(toFloat(positiveVolume - negativeVolume) / frequency), 2) AS polarizationScore
        ORDER BY frequency DESC
        LIMIT 50
    """;
    }

    public String getEventMomentumQuery() {
        return """
        MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)
        WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
          AND n.publish_date <= datetime({epochMillis: $endEpoch})
          AND n.sentiment IS NOT NULL
        WITH e, date(n.publish_date) AS publishDate,
            count(n) AS dailyVolume,
            sum(CASE WHEN n.sentiment > 0 THEN 1 ELSE 0 END) AS dailyPositive,
            sum(CASE WHEN n.sentiment < 0 THEN 1 ELSE 0 END) AS dailyNegative
        RETURN
            e.name AS event,
            collect({
                date: toString(publishDate),
                volume: dailyVolume,
                positiveVolume: dailyPositive,
                negativeVolume: dailyNegative
            }) AS timeline,
            sum(dailyVolume) AS totalVolume
        ORDER BY totalVolume DESC
        LIMIT 10
    """;
    }

    public String getNewsByLocationName(){
        return """
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)<-[:PUBLISHED]-(s:Source)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND l.name = $locationName
            RETURN
                n.title AS title,
                n.sentiment AS sentiment,
                toString(n.publish_date) AS date,
                s.name AS source,
                n.content_hash AS contentHash
            ORDER BY n.publish_date DESC
        """;
    }

    public String getNewsByCountryName(){
        return """
            MATCH (l:Location)<-[:MENTIONS_LOCATION]-(n:News)<-[:PUBLISHED]-(s:Source)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND l.country = $countryName
            RETURN
                n.title AS title,
                n.sentiment AS sentiment,
                toString(n.publish_date) AS date,
                s.name AS source,
                n.content_hash AS contentHash
            ORDER BY n.publish_date DESC
        """;
    }

    public String getNewsByEventName(){
        return """
            MATCH (e:Event)<-[:MENTIONS_EVENT]-(n:News)<-[:PUBLISHED]-(s:Source)
            WHERE n.publish_date >= datetime({epochMillis: $startEpoch})
                AND n.publish_date <= datetime({epochMillis: $endEpoch})
                AND e.name = $eventName
            RETURN
                n.title AS title,
                n.sentiment AS sentiment,
                toString(n.publish_date) AS date,
                s.name AS source,
                n.content_hash AS contentHash
            ORDER BY n.publish_date DESC
        """;
    }
}
