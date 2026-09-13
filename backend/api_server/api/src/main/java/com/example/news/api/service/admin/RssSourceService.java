package com.example.news.api.service.admin;

import com.example.news.api.dto.response.admin.RssSourceResponse;
import com.example.news.api.entity.RssSourceEntity;
import com.example.news.api.repository.news.RssSourceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RssSourceService {
    private final RssSourceRepository rssSourceRepository;

    public RssSourceService(RssSourceRepository rssSourceRepository){
        this.rssSourceRepository = rssSourceRepository;
    }

    public List<RssSourceResponse> getAllRssSources(){
        return rssSourceRepository.findAll()
                .stream()
                .map(source -> (
                    new RssSourceResponse(
                            source.getId(),
                            source.getUrl(),
                            source.getSourceName(),
                            source.getEnabled(),
                            source.getCreatedAt()
                    )
                ))
                .toList();
    }

    @Transactional
    public void setEnableRssSources(Long rssSourceId, boolean isEnabled){
        Optional<RssSourceEntity> foundRssSource = rssSourceRepository.findById(rssSourceId);
        foundRssSource.ifPresent(rssSourceEntity -> rssSourceEntity.setEnabled(isEnabled));
    }
}
