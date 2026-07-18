package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private Task.TaskStatus status;

    @NotNull(message = "Priority is required")
    private Task.TaskPriority priority;

    @NotNull(message = "Project ID is required")
    @Positive(message = "Project ID must be positive")
    private Long projectId;

    private Long assignedTo;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDate dueDate;

    private Double estimatedHours;

    private Double actualHours;

    /**
     * Convert Task entity to DTO
     */
    public static TaskDTO fromEntity(Task task) {
        return new TaskDTO(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getPriority(),
            task.getProjectId(),
            task.getAssignedTo(),
            task.getCreatedAt(),
            task.getUpdatedAt(),
            task.getDueDate(),
            task.getEstimatedHours(),
            task.getActualHours()
        );
    }

    /**
     * Convert DTO to Task entity
     */
    public Task toEntity() {
        Task task = new Task();
        task.setId(this.id);
        task.setTitle(this.title);
        task.setDescription(this.description);
        task.setStatus(this.status);
        task.setPriority(this.priority);
        task.setProjectId(this.projectId);
        task.setAssignedTo(this.assignedTo);
        task.setDueDate(this.dueDate);
        task.setEstimatedHours(this.estimatedHours);
        task.setActualHours(this.actualHours);
        return task;
    }
}
