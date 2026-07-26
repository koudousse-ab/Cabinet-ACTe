package com.cabinet.acte.service;

import com.cabinet.acte.dto.ProjectDTO;
import com.cabinet.acte.entity.Project;

import java.util.List;

public interface ProjectService {

    ProjectDTO createProject(ProjectDTO projectDTO);

    ProjectDTO getProjectById(Long id);

    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);

    void deleteProject(Long id);

    List<ProjectDTO> getAllProjects();

    List<ProjectDTO> getProjectsByStatus(Project.ProjectStatus status);

    List<ProjectDTO> getProjectsByClient(String client);

    List<ProjectDTO> filterProjects(Project.ProjectStatus status, String client);

    List<ProjectDTO> searchProjects(String query);
}
