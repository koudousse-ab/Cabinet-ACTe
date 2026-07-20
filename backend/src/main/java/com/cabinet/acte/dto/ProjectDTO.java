package com.cabinet.acte.dto;

import com.cabinet.acte.entity.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {

    private Long id;

    @NotBlank(message = "Le nom du projet est obligatoire")
    private String name;

    @NotBlank(message = "Le client est obligatoire")
    private String client;

    private String description;

    @NotNull(message = "Le statut est obligatoire")
    private Project.ProjectStatus status;

    private LocalDate startDate;

    private LocalDate endDate;

    private LocalDateTime createdAt;

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
