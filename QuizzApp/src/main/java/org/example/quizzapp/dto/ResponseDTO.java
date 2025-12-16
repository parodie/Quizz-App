package org.example.quizzapp.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDTO {
    private Long id;
    private String displayName;
    private LocalDateTime submittedAt;
    private int score;
    private List<AnswerDTO> answers;
}
