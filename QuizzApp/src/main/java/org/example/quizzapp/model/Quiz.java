package org.example.quizzapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    private String description;

    @Column(nullable = false)
    @Builder.Default
    private boolean requiresAuth = false;

    @Column(unique = true)
    private String shareToken;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreatedDate
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private int passingScore;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonManagedReference
    private List<Question> questions = new ArrayList<>();
}