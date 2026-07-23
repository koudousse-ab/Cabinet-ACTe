package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Task;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private Task.TaskStatus status;
    private Task.TaskPriority priority;
    private Long projectId;
    private Long assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDate dueDate;
    private Double estimatedHours;
    private Double actualHours;

    public TaskDTO() {}
    public TaskDTO(Long id, String title, String description, Task.TaskStatus status, Task.TaskPriority priority,
                   Long projectId, Long assignedTo, LocalDateTime createdAt, LocalDateTime updatedAt,
                   LocalDate dueDate, Double estimatedHours, Double actualHours) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.projectId = projectId;
        this.assignedTo = assignedTo;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.dueDate = dueDate;
        this.estimatedHours = estimatedHours;
        this.actualHours = actualHours;
    }

    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Task.TaskStatus getStatus() { return status; }
    public Task.TaskPriority getPriority() { return priority; }
    public Long getProjectId() { return projectId; }
    public Long getAssignedTo() { return assignedTo; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDate getDueDate() { return dueDate; }
    public Double getEstimatedHours() { return estimatedHours; }
    public Double getActualHours() { return actualHours; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(Task.TaskStatus status) { this.status = status; }
    public void setPriority(Task.TaskPriority priority) { this.priority = priority; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public void setAssignedTo(Long assignedTo) { this.assignedTo = assignedTo; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }
    public void setActualHours(Double actualHours) { this.actualHours = actualHours; }

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
