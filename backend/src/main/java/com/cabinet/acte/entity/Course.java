package com.cabinet.acte.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "course")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    // Enseignant assigné au cours
    @Column(name = "assigned_to")
    private Long assignedTo;

    // Classe concernée par le cours (permet aux étudiants de voir leur programme individuel)
    @Column(name = "classe")
    private String classe;

    // Étudiants individuellement cochés par l'administrateur pour suivre ce cours
    @ElementCollection
    @CollectionTable(name = "course_students", joinColumns = @JoinColumn(name = "course_id"))
    @Column(name = "etudiant_id")
    private Set<Long> studentIds = new HashSet<>();

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CourseStatus status = CourseStatus.PLANNED;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CourseStatus {
        PLANNED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}
