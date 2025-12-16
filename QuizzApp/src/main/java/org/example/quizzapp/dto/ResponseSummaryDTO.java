package org.example.quizzapp.dto;

import lombok.*;

import java.time.LocalDateTime;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSummaryDTO {
    private Long id;
    private String displayName;
    private LocalDateTime submittedAt;
    private int score;

}
