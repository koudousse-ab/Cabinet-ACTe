package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProjectDTO {
    private Long id;
    private String name;
    private String client;
    private String description;
    private Project.ProjectStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;

    public ProjectDTO() {}
    public ProjectDTO(Long id, String name, String client, String description, Project.ProjectStatus status,
                      LocalDate startDate, LocalDate endDate, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.client = client;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getClient() { return client; }
    public String getDescription() { return description; }
    public Project.ProjectStatus getStatus() { return status; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setClient(String client) { this.client = client; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(Project.ProjectStatus status) { this.status = status; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ProjectDTO fromEntity(Project project) {
        return new ProjectDTO(
            project.getId(),
            project.getName(),
            project.getClient(),
            project.getDescription(),
            project.getStatus(),
            project.getStartDate(),
            project.getEndDate(),
            project.getCreatedAt()
        );
    }

    public Project toEntity() {
        Project project = new Project();
        project.setId(this.id);
        project.setName(this.name);
        project.setClient(this.client);
        project.setDescription(this.description);
        project.setStatus(this.status);
        project.setStartDate(this.startDate);
        project.setEndDate(this.endDate);
        return project;
    }
}
