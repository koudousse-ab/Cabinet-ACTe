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

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    @NotNull(message = "Le statut est obligatoire")
    private Task.TaskStatus status;

    @NotNull(message = "La priorité est obligatoire")
    private Task.TaskPriority priority;

    @NotNull(message = "Le projet est obligatoire")
    @Positive(message = "L'identifiant du projet doit être positif")
    private Long projectId;

    private Long assignedTo;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDate dueDate;

    private Double estimatedHours;

    private Double actualHours;

    /**
     * Convertit l'entité Task en DTO
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
     * Convertit le DTO en entité Task
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
