package com.example.news.api.repository.news;

import com.example.news.api.dto.internal.news.DetailedSourceNews;
import com.example.news.api.dto.response.news.NewsResponse;
import com.example.news.api.entity.SourceEntity;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class GraphNewsRepositoryImpl implements  GraphNewsRepository {
    private final Neo4jClient neo4jClient;
    private final SourceRepository sourceRepository;

    public GraphNewsRepositoryImpl(
            Neo4jClient neo4jClient,
            SourceRepository sourceRepository
    ){
        this.neo4jClient = neo4jClient;
        this.sourceRepository = sourceRepository;
    }

    private Long findSourceId (String sourceName) {
        return sourceRepository.findByName(sourceName)
                .map(SourceEntity::getId)
                .orElse(0L);
    }

    private NewsResponse toNewsResponse(
            UUID id, String title, String link, String lang, Timestamp publishDate, String sourceName
    ){
        NewsResponse response = new NewsResponse();
        response.setId(id);
        response.setTitle(title);
        response.setLink(link);
        response.setLang(lang);
        response.setPublishDate(publishDate);

        DetailedSourceNews detailedSourceNews = new DetailedSourceNews();
        detailedSourceNews.setId(findSourceId(sourceName));
        detailedSourceNews.setName(sourceName);
        response.setSource(detailedSourceNews);

        return response;
    }

    @Override
    public List<NewsResponse> getNewsByKeyphrase(String keyphrase) {
        return neo4jClient.query("""
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:TAGGED_WITH]->(k:Keyphrase {name: $keyphrase})
            RETURN n.id as id,
                n.title as title,
                n.link as link,
                n.language as lang,
                n.publish_date as publishDate,
                s.name AS sourceName
            ORDER BY publishDate DESC
            LIMIT 25;
        """)
                .bind(keyphrase).to("keyphrase")
                .fetch()
                .all()
                .stream()
                .map(record -> toNewsResponse(
                        UUID.fromString(String.valueOf(record.get("id"))),
                        (String) record.get("title"),
                        (String) record.get("link"),
                        (String) record.get("language"),
                        Timestamp.valueOf((String) record.get("publishDate")),
                        (String) record.get("sourceName")

                ))
                .toList();
    }

    @Override
    public List<NewsResponse> getNewsByLocation(String location) {
        return neo4jClient.query("""
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:MENTIONS_LOCATION]->(l:Location {name: $location})
            RETURN n.id as id,
                n.title as title,
                n.link as link,
                n.language as lang,
                n.publish_date as publishDate,
                s.name AS sourceName
            ORDER BY publishDate DESC
            LIMIT 25;
        """)
                .bind(location).to("location")
                .fetch()
                .all()
                .stream()
                .map(record -> toNewsResponse(
                        UUID.fromString(String.valueOf(record.get("id"))),
                        (String) record.get("title"),
                        (String) record.get("link"),
                        (String) record.get("language"),
                        Timestamp.valueOf((String) record.get("publishDate")),
                        (String) record.get("sourceName")

                ))
                .toList();
    }

    @Override
    public List<NewsResponse> getNewsByEvent(String event) {
        return neo4jClient.query("""
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:MENTIONS_EVENT]->(e:Event {name: $event})
            RETURN n.id as id,
                n.title as title,
                n.link as link,
                n.language as lang,
                n.publish_date as publishDate,
                s.name AS sourceName
            ORDER BY publishDate DESC
            LIMIT 25;
        """)
                .bind(event).to("event")
                .fetch()
                .all()
                .stream()
                .map(record -> toNewsResponse(
                        UUID.fromString(String.valueOf(record.get("id"))),
                        (String) record.get("title"),
                        (String) record.get("link"),
                        (String) record.get("language"),
                        Timestamp.valueOf((String) record.get("publishDate")),
                        (String) record.get("sourceName")

                ))
                .toList();
    }

    @Override
    public List<NewsResponse> getNewsByOrganization(String organization) {
        return neo4jClient.query("""
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:MENTIONS_Organization]->(o:Organization {name: $organization})
            RETURN n.id as id,
                n.title as title,
                n.link as link,
                n.language as lang,
                n.publish_date as publishDate,
                s.name AS sourceName
            ORDER BY publishDate DESC
            LIMIT 25;
        """)
                .bind(organization).to("organization")
                .fetch()
                .all()
                .stream()
                .map(record -> toNewsResponse(
                        UUID.fromString(String.valueOf(record.get("id"))),
                        (String) record.get("title"),
                        (String) record.get("link"),
                        (String) record.get("language"),
                        Timestamp.valueOf((String) record.get("publishDate")),
                        (String) record.get("sourceName")

                ))
                .toList();
    }

    @Override
    public List<NewsResponse> getNewsByPerson(String person) {
        return neo4jClient.query("""
            MATCH (s:Source)-[:PUBLISHED]->(n:News)-[:MENTIONS_PERSON]->(p:Person {name: $person})
            RETURN n.id as id,
                n.title as title,
                n.link as link,
                n.language as lang,
                n.publish_date as publishDate,
                s.name AS sourceName
            ORDER BY publishDate DESC
            LIMIT 25;
        """)
                .bind(person).to("person")
                .fetch()
                .all()
                .stream()
                .map(record -> toNewsResponse(
                        UUID.fromString(String.valueOf(record.get("id"))),
                        (String) record.get("title"),
                        (String) record.get("link"),
                        (String) record.get("language"),
                        Timestamp.valueOf((String) record.get("publishDate")),
                        (String) record.get("sourceName")

                ))
                .toList();
    }

    @Override
    public List<NewsResponse> getNewsBySource(String sourceName) {
        return neo4jClient.query("""
            MATCH (n:News) <-[:PUBLISHED]- (s:Source {name: $sourceName})
            RETURN n.id as id,
                n.title as title,
                n.link as link,
                n.language as lang,
                n.publish_date as publishDate,
                s.name AS sourceName
            ORDER BY publishDate DESC
            LIMIT 25;
        """)
                .bind(sourceName).to("sourceName")
                .fetch()
                .all()
                .stream()
                .map(record -> toNewsResponse(
                        UUID.fromString(String.valueOf(record.get("id"))),
                        (String) record.get("title"),
                        (String) record.get("link"),
                        (String) record.get("language"),
                        Timestamp.valueOf((String) record.get("publishDate")),
                        (String) record.get("sourceName")

                ))
                .toList();
    }

    @Override
    public List<NewsResponse> getNewsByTopic(String topic) {
        return neo4jClient.query("""
            MATCH (s:Source) -[:PUBLISHED]-> (n:News) -[:COVERS]-> (t:Topic {name:$topic})
            RETURN n.id as id,
                n.title as title,
                n.link as link,
                n.language as lang,
                n.publish_date as publishDate,
                s.name AS sourceName
            ORDER BY publishDate DESC
            LIMIT 25;
        """)
                .bind(topic).to("topic")
                .fetch()
                .all()
                .stream()
                .map(record -> toNewsResponse(
                        UUID.fromString(String.valueOf(record.get("id"))),
                        (String) record.get("title"),
                        (String) record.get("link"),
                        (String) record.get("language"),
                        Timestamp.valueOf((String) record.get("publishDate")),
                        (String) record.get("sourceName")

                ))
                .toList();
    }
}
