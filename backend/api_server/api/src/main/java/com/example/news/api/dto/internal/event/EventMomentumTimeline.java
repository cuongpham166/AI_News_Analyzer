package com.example.news.api.dto.internal.event;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EventMomentumTimeline {
    private String date;
    private int volume;
    private int positiveVolume;
    private int negativeVolume;
}
