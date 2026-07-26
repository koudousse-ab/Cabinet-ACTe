package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Course;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalTime startTime;
    private Long assignedTo;
    private String classe;
    private Course.CourseStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CourseDTO fromEntity(Course course) {
        return new CourseDTO(
            course.getId(),
            course.getTitle(),
            course.getDescription(),
            course.getStartDate(),
            course.getEndDate(),
            course.getStartTime(),
            course.getAssignedTo(),
            course.getClasse(),
            course.getStatus(),
            course.getCreatedAt(),
            course.getUpdatedAt()
        );
    }

    public Course toEntity() {
        Course course = new Course();
        course.setId(this.id);
        course.setTitle(this.title);
        course.setDescription(this.description);
        course.setStartDate(this.startDate);
        course.setEndDate(this.endDate);
        course.setStartTime(this.startTime);
        course.setAssignedTo(this.assignedTo);
        course.setClasse(this.classe);
        course.setStatus(this.status != null ? this.status : Course.CourseStatus.PLANNED);
        return course;
    }
}
