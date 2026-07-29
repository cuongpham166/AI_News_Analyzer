package com.example.news.api.dto.internal.news;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DetailedKeyphraseNews {
    private Long id;
    private String value;
}
